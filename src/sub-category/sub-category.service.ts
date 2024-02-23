import { Injectable } from "@nestjs/common";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class SubCategoryService {
  constructor(private prisma: PrismaService) {}

  async bulkCreate(subCategoryData) {
    try {
      const oldData = await this.findAll();
      const unique = subCategoryData.filter(
        (a, i) => subCategoryData.findIndex((s) => a.name === s.name) === i
      );
      const filteredList = unique.filter(
        ({ name: category }) =>
          !oldData.some(({ name: oldCategory }) => oldCategory === category)
      );

   

      if (!filteredList?.length) return;

      const response = await this.prisma.subcategory.createMany({
        data: filteredList,
      });
      return response;
    } catch (err) {
      console.debug("Error creating category", err);
    }
  }


  async createSubCategory(createSubCategoryDto) {
    try {
      return await this.prisma.subcategory.create({
        data: createSubCategoryDto,
      });
    } catch (err) {
      console.debug(err, "Could not create sub-category");
    }
  }

  async findAll() {
    try {
      const allSubCategory = await this.prisma.subcategory.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
        },
      });
      return allSubCategory;
    } catch (err) {
      console.debug(err, "Could not fetch all subCategory");
    }
  }

  async read(id: string) {
    try {
      const response = await this.prisma.subcategory.findUnique({
        where: {
          id
        },
        include: {
          category: true
        }
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not find subCategory");
    }
  }

  async updateSubCategory(
    subId: string,
    updateSubCategoryDto: UpdateSubCategoryDto
  ) {
    try {
      const response = await this.prisma.subcategory.update({
        where: {
          id: subId,
        },
        data: updateSubCategoryDto,
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not update subCategory");
    }
  }

  async deleteSubCategory(subId: string) {
    try {
      const response = await this.prisma.subcategory.update({
        where: {
          id: subId,
        },
        data: {
          isDeleted: true,
        },
      });
    } catch (err) {
      console.debug(err, "Could not delete subCategory");
    }
  }
  async deleteAll() {
    try {
      const response = await this.prisma.subcategory.deleteMany();
      return response;
    } catch (err) {
      console.log(err, "Could not delete all subCategory");
    }
  }
}
