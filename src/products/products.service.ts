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

  async createProduct(itemData) {
    itemData.quantity = Number(itemData.quantity || 0);

    try {
      const response = await this.prisma.products.create({
        data: itemData,
      });
      return response;
    } catch (error) {
      console.debug(error, "\n cannot create product \n");
      return error;
    }
  }

  async bulkCreate(itemData) {
    try {
      const productData = await this.prisma.products.findMany();

      const filteredItemData = itemData.filter((item) => {
        return !productData.some((product) => product.name === item.name);
      });

      const getUser = await this.prisma.user.findFirst({
        where: {
          id: "6594fb86c90cd77e87d7b832",
        },
      });

      const filteredtax = filteredItemData.filter((item) => {
        return !getUser?.restaurant?.taxes.some((product) => {
          product.percentage === item?.tax && product?.type === item?.taxType;
        });
      });

      let taxData = [];
      const data = filteredtax.map((item) => {
        taxData.push({ type: item?.taxType, percentage: Number(item?.tax) });
      });

      taxData = taxData.concat(
        getUser?.restaurant?.taxes.map((tax) => ({
          type: tax.type,
          percentage: tax.percentage,
        }))
      );

      const uniqueTaxData = taxData.filter(
        (obj, index, self) =>
          index ===
          self.findIndex(
            (t) => t.type === obj.type && t.percentage === obj.percentage
          )
      );

      await this.prisma.user.update({
        where: {
          id: "6594fb86c90cd77e87d7b832",
        },
        data: {
          restaurant: {
            taxes: uniqueTaxData,
          },
        },
      });

      if (filteredItemData.length) {
        const response = await this.prisma.products.createMany({
          data: filteredItemData,
        });
        return response;
      } else {
        return "Nothing to Add";
      }
    } catch (error) {
      console.debug(error, "\n bulk create failed \n");
      return error;
    }
  }

  async handleItemsUpload(csvData: { [key: string]: string }[] = []) {
    const categoryData = csvData?.map((rowData: { [key: string]: string }) => ({
      name: rowData?.category.toLowerCase(),
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

    await this.subCategoryService.bulkCreate(subCategoryData);

    const subCategoryResult = await this.subCategoryService.findAll();

    const itemData = csvData?.map((rowData: { [key: string]: string }) => {
      const categoryDetail = subCategoryResult.find(
        (categoryInfo) =>
          categoryInfo?.name === rowData?.subcategory?.toLowerCase()
      );

      return {
        name: rowData?.name,
        price: rowData?.price,
        measuredIn: rowData?.measuredIn || "",
        code: rowData?.code,
        categoryId: categoryDetail?.categoryId,
        subcategoryId: categoryDetail?.id,
        tax: rowData?.tax,
        taxType: rowData?.taxtype || "",
      };
    });

    return this.bulkCreate(itemData);
  }

  async getAllItems() {
    try {
      const products = await this.prisma.products.findMany({
        where: {
          isDeleted: {
            equals: false,
          },
        },
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

  async getProductsFromIdsArray(productIdsList: string[]) {
    const products = await this.prisma.products.findMany({
      where: {
        id: {
          in: productIdsList,
        },
      },
      include: {
        category: true,
        subcategory: true,
      },
    });

    return products;
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
