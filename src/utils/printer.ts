const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const CharacterSet = require("node-thermal-printer").CharacterSet;
const BreakLine = require("node-thermal-printer").BreakLine;

const resturant = {
  _id: {
    $oid: "653ba42dbab77fb612b47413",
  },
  name: "Mobe",
  phone: "94654535543",
  address: "Elante Mall",
  taxId: "0393jkqlfi",
  taxIdType: "gstin",
  discountPassword:
    "$2b$10$caEAJ9BJOfnWhw6Z0lN6kO.PcsGxzYQXgx4hcOXKiqqZMVRt41Vvq",
  // needed logo to display in bill
};

const kotHeader = (printer, id, stewardName, tableCode) => {
  printer.alignLeft();
  printer.print("KOT Number: ");
  printer.print(id);
  printer.newLine();
  printer.print("Steward: ");
  printer.print(stewardName);
  printer.newLine();
  printer.print("Table Number: ");
  printer.print(tableCode);
  printer.newLine();

  printer.println("----------------------------------------");
  printer.bold(true);
  printer.tableCustom([
    { text: "Description", align: "LEFT", width: 0.4 },
    { text: "Qty", align: "RIGHT", width: 0.2 },
  ]);
  printer.bold(false);
  printer.println("----------------------------------------");
};

const kotFooter = (printer, modifier) => {
  printer.println("----------------------------------------");
  printer.newLine();

  if (modifier) {
    printer.print("Modifiers: ");
    printer.print(modifier);
  }
};

const formatString = (str) => {
  const formattedIntegerPart = parseInt(str).toLocaleString("en-IN", {
    useGrouping: true,
  });
  const decimalPart = (Math.abs(str) % 1).toFixed(2).substring(2);
  const formattedAmount = `${formattedIntegerPart}.${decimalPart}`;

  return formattedAmount;
};

const formatStringWithoutDecimal = (str) => {
  const formattedIntegerPart = parseInt(str).toLocaleString("en-IN", {
    useGrouping: true,
  });
  const formattedAmount = `${formattedIntegerPart}`;

  return formattedAmount;
};

const printBilReceipt = async (data = null, steward = null, type) => {
  let isFoodAvailable = false;
  let isBevaragesAvailable = false;

  let barPrinter = new ThermalPrinter({
    type: PrinterTypes.TANCA,
    interface: process.env.BAR_PRINTER,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
    options: { timeout: 5000 },
  });

  let kitchenPrinter = new ThermalPrinter({
    type: PrinterTypes.TANCA,
    interface: process.env.KITCHEN_PRINTER,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
    options: { timeout: 5000 },
  });

  let billPrinter = new ThermalPrinter({
    type: PrinterTypes.TANCA,
    interface: process.env.BILL_PRINTER,
    characterSet: CharacterSet.PC852_LATIN2,
    removeSpecialCharacters: false,
    lineCharacter: "=",
    breakLine: BreakLine.WORD,
    options: { timeout: 5000 },
  });

  let isBillPrinterConnected = await billPrinter.isPrinterConnected();
  let isKitchenPrinterConnected = await billPrinter.isPrinterConnected();
  let isBarPrinterConnected = await billPrinter.isPrinterConnected();

  if (type == "bill" && isBillPrinterConnected) {
    const {
      name,
      phone,
      subTotal,
      discount,
      tax,
      netAmount,
      foodDiscount,
      barDiscount,
      discountReason,
    } = data;

    billPrinter.alignCenter();
    await billPrinter.print(resturant.name);
    billPrinter.newLine();
    billPrinter.alignCenter();
    await billPrinter.print(resturant.phone);
    billPrinter.newLine();
    billPrinter.alignCenter();
    await billPrinter.print(resturant.address);
    billPrinter.println("");

    billPrinter.alignLeft();
    billPrinter.print("Customer Name: ");
    await billPrinter.print(name);
    billPrinter.newLine();
    billPrinter.print("Customer Phone: ");
    await billPrinter.print(phone);
    billPrinter.newLine();

    billPrinter.println("----------------------------------------");
    billPrinter.bold(true);
    await billPrinter.tableCustom([
      { text: "Description", align: "LEFT", width: 0.3 },
      { text: "Qty", align: "CENTER", width: 0.1 },
      { text: "Rate", align: "CENTER", width: 0.2 },
      { text: "Amount", align: "RIGHT", width: 0.2 },
    ]);
    billPrinter.bold(false);
    billPrinter.println("----------------------------------------");
    console.log("Bill Print products", data.products);
    for (const item of data.products) {
      if (typeof item === "object" && item.product) {
        const productName = item.product.name;
        const productQuantity = item.quantity;
        const productPrice = parseFloat(item.product.price);
        const amount = item.amount;

        await billPrinter.setTypeFontA();
        await billPrinter.tableCustom([
          { text: productName, align: "LEFT", width: 0.3 },
          { text: productQuantity, align: "CENTER", width: 0.1 },
          {
            text: formatStringWithoutDecimal(productPrice),
            align: "RIGHT",
            width: 0.2,
          },
          {
            text: formatStringWithoutDecimal(amount),
            align: "RIGHT",
            width: 0.2,
          },
        ]);
      }
    }
    billPrinter.println("----------------------------------------");

    await billPrinter.tableCustom([
      { text: "Net Amount: ", align: "LEFT", width: 0.4 },
      { text: formatString(subTotal), align: "RIGHT", width: 0.4 },
    ]);
    await billPrinter.tableCustom([
      { text: "GST + VAT: ", align: "LEFT", width: 0.4 },
      { text: formatString(tax), align: "RIGHT", width: 0.4 },
    ]);
    await billPrinter.tableCustom([
      { text: "Discount: ", align: "LEFT", width: 0.4 },
      { text: formatString(discount), align: "RIGHT", width: 0.4 },
    ]);
    billPrinter.println("----------------------------------------");

    await billPrinter.tableCustom([
      { text: "Total: ", align: "LEFT", width: 0.4 },
      { text: formatString(netAmount), align: "RIGHT", width: 0.4 },
    ]);

    billPrinter.newLine();

    if (foodDiscount) {
      billPrinter.alignLeft();
      billPrinter.print("Food Discount: ");
      await billPrinter.print(formatString(foodDiscount));
      billPrinter.newLine();
    }
    if (barDiscount) {
      billPrinter.print("Bar Discount: ");
      await billPrinter.print(formatString(barDiscount));
      billPrinter.newLine();
    }

    if (discountReason) {
      billPrinter.print("Discount Reason: ");
      await billPrinter.print(discountReason);
      billPrinter.newLine();
    }

    billPrinter.newLine();
    billPrinter.alignCenter();
    billPrinter.println("Thank you for visiting!");
  } else if (data && isBarPrinterConnected && isKitchenPrinterConnected) {
    // KOT
    const { kotNo, kotData, modifier, table } = data;

    kotHeader(barPrinter, kotNo, steward?.name, table?.code);
    kotHeader(kitchenPrinter, kotNo, steward?.name, table?.code);

    console.log("KOT Print products", kotData);

    for (const item of kotData) {
      if (typeof item === "object" && item.product) {
        const productName = item.product.name;
        const productQuantity = item.quantity;
        if (item.product.category.name === "food") {
          console.log("Food Item: ", item);
          kitchenPrinter.setTypeFontA();
          kitchenPrinter.tableCustom([
            { text: productName, align: "LEFT", width: 0.4 },
            { text: productQuantity, align: "RIGHT", width: 0.2 },
          ]);
          isFoodAvailable = true;
        } else {
          console.log("Beverage Item: ", item);
          barPrinter.setTypeFontA();
          barPrinter.tableCustom([
            { text: productName, align: "LEFT", width: 0.4 },
            { text: productQuantity, align: "RIGHT", width: 0.2 },
          ]);
          isBevaragesAvailable = true;
        }
      }
    }
    kotFooter(kitchenPrinter, modifier);
    kotFooter(barPrinter, modifier);
  }

  try {
    let isBillPrinterSuccess = false;
    let isKitchenPrinterSuccess = false;
    let isBarPrinterSuccess = false;
    if (type == "bill" && isBillPrinterConnected) {
      billPrinter.cut();
      billPrinter.execute();
      isBillPrinterSuccess = true;
      console.log("Print done!");
    } 
    if (isBevaragesAvailable && isBarPrinterConnected) {
      barPrinter.cut();
      barPrinter.execute();
      isBarPrinterSuccess = true;
      console.log("Print done!");
    }
    if (isFoodAvailable && isKitchenPrinterConnected) {
      kitchenPrinter.cut();
      kitchenPrinter.execute();
      isKitchenPrinterSuccess = true;
      console.log("Print done!");
    }
    return { isBillPrinterSuccess, isKitchenPrinterSuccess, isBarPrinterSuccess };
  } catch (error) {
    console.error("Print failed:", error);
  }
};

export { printBilReceipt };