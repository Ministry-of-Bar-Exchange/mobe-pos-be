import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto, UpdateItemQuantity } from "./dto/update-item.dto";
import { CategoryService } from "category/category.service";
import { SubCategoryService } from "sub-category/sub-category.service";
import { replaceSpecialCharsFromTax } from "utils/common";
import { COMMON_TAX } from "constants/common";

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService
  ) {}

  async createOneItem(itemData) {
    const itemPriceCalculate =
      parseInt(itemData?.amount) / parseInt(itemData?.quantity);
    itemData.price = itemPriceCalculate.toString();
    itemData.quantity = Number(itemData.quantity);

    try {
      const response = await this.prisma.products.create({
        data: itemData,
      });
      return response;
    } catch (error) {
      console.debug(error, "\n cannot create OneItem \n");
      return error;
    }
  }

  async bulkCreate(itemData) {
    try {
      const response = await this.prisma.products.createMany({
        data: itemData,
      });
      return response;
    } catch (error) {
      console.debug(error, "\n bulk create failed \n");
      return error;
    }
  }

  async handleItemsUpload(csvData: { [key: string]: string }[] = []) {
    const categoryData = csvData?.map((rowData: { [key: string]: string }) => ({
      name: rowData?.category.toLowerCase(),
      tax: replaceSpecialCharsFromTax(rowData?.["tax"]?.split(" ")?.[1]) || COMMON_TAX,
    }));

    const filteredCategory = categoryData.filter((category, index) => {
      return index === categoryData.findIndex((o) => category.name === o.name);
    });

    await this.categoryService.bulkCreate(filteredCategory);

    const categoryResult = await this.categoryService.findAll();

    const subCategoryData = [];

    csvData?.forEach((rowData: { [key: string]: string }) => {
      const categoryInfo = categoryResult.find(
        (category) => category.name === rowData?.category?.toLowerCase()
      );

      if (!categoryInfo?.id) return;
      return subCategoryData.push({
        name: rowData?.subcategory?.toLowerCase(),
        categoryId: categoryInfo?.id,
      });
    });

    console.debug(
      "\n subCategoryData ",
      subCategoryData,
      " subCategoryData \n"
    );
    await this.subCategoryService.bulkCreate(subCategoryData);

    const subCategoryResult = await this.subCategoryService.findAll();

    console.debug(
      "\n subCategoryResult",
      subCategoryResult,
      " subCategoryResult \n "
    );

    const itemData = csvData?.map((rowData: { [key: string]: string }) => {
      const categoryDetail = subCategoryResult.find(
        (categoryInfo) =>
          categoryInfo?.name === rowData?.subcategory?.toLowerCase()
      );
      return {
        name: rowData?.products,
        price: rowData?.rate,
        measuredIn: rowData?.unit || "",
        code: rowData?.["item code"],
        categoryId: categoryDetail?.categoryId,
        subcategoryId: categoryDetail?.id,
      };
    });

    console.debug("\n itemData", itemData, " itemData \n ");
    return this.bulkCreate(itemData);
  }

  async getAllItems() {
    try {
      const products = await this.prisma.products.findMany({
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          category: true,
          subcategory: true,
        },
      });

      return products;
    } catch (err) {
      console.debug(err, "Cannot get all products");
    }
  }

  async read(id: string) {
    try {
      const response = await this.prisma.products.findUnique({
        where: {
          id,
        },
        include: {
          category: true,
          subcategory: true,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not find products");
    }
  }

  async findOneItem(itemId: string) {
    try {
      const response = await this.prisma.products.findMany({
        where: {
          id: itemId,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Cannot find item");
    }
  }

  async updateItem(itemId: string, updateItemDto: UpdateItemDto) {
    try {
      const response = await this.prisma.products.update({
        where: {
          id: itemId,
        },
        data: updateItemDto,
      });
      return response;
    } catch (err) {
      console.debug("Failed to update item", err);
    }
  }

  // async handleUpdateItemQuantity(updateItemDto: UpdateItemQuantity) {
  //   const itemId = updateItemDto.itemId;
  //   const action = updateItemDto["action"] || "increment";

  //   const quantityToBeUpdated = updateItemDto?.quantity;

  //   if (!quantityToBeUpdated) {
  //     throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
  //   }

  //   try {
  //     const response = await this.prisma.products.update({
  //       where: {
  //         id: itemId,
  //       },
  //       data: {
  //         quantity: {
  //           [action]: Number(quantityToBeUpdated),
  //         },
  //       },
  //     });
  //   } catch (err) {
  //     console.debug("Failed to update item", err);
  //   }
  // }

  // async updateItemQuantity(itemId: string, quantity: string) {
  //   const particularItem: any = await this.findOneItem(itemId);
  //   const updatedQuantity =
  //     parseInt(particularItem[0]?.quantity) - parseInt(quantity);
  //   const newAmount = parseInt(particularItem[0]?.price) * parseInt(quantity);
  //   const calculatedAmount = parseInt(particularItem[0]?.amount) - newAmount;
  //   particularItem[0].quantity = updatedQuantity.toString();
  //   particularItem[0].amount = calculatedAmount.toString();
  //   try {
  //     const response = await this.prisma.products.update({
  //       where: {
  //         id: itemId,
  //       },
  //       data: {
  //         quantity: particularItem[0].quantity,
  //       },
  //     });
  //     return {
  //       response: response,
  //       status: "Success",
  //     };
  //   } catch (err) {
  //     console.debug("FAILED to update item in stock out", err);
  //   }
  // }

  async deleteItem(itemId: string) {
    try {
      const response = await this.prisma.products.update({
        where: {
          id: itemId,
        },
        data: {
          isDeleted: true,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Delete item failed");
    }
  }

  async deleteAll() {
    const response = await this.prisma.products.deleteMany();
    return response;
  }
}
