import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async bulkCreate(categoryData) {
    try {
      console.debug(categoryData, "\n category \n");

      const oldData = await this.findAll();
      const unique = categoryData.filter(
        (a, i) => categoryData.findIndex((s) => a.name === s.name) === i
      );
      const filteredList = unique.filter(
        ({ name: category }) =>
          !oldData.some(({ name: oldCategory }) => oldCategory === category)
      );
      console.debug(filteredList, "\n filteredList \n");

      if (!filteredList?.length) return null;
      const response = await this.prisma.category.createMany({
        data: filteredList,
      });
      return response;
    } catch (error) {
      console.debug(error, "\n error \n");
    }
  }

  async createCategory(createCategoryDto) {
    try {
      return this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (err) {
      console.debug(err, "Could not create category");
    }
  }

  async read(id: string) {
    try {
      const response = await this.prisma.category.findUnique({
        where: {
          id,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not find category");
    }
  }

  async findAll() {
    try {
      const response = await this.prisma.category.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          subcategory: {
            include: {
              products: {
                include: {
                  category: true,
                  subcategory: true,
                },
              },
            },
          },
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not find category");
    }
  }

  async updateCategory(
    CategoryId: string,
    updateCategoryDto: UpdateCategoryDto
  ) {
    try {
      const response = await this.prisma.category.update({
        where: {
          id: CategoryId,
        },
        data: updateCategoryDto,
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not update category");
    }
  }

  async deleteCategory(CategoryId: string) {
    try {
      const response = await this.prisma.category.update({
        where: {
          id: CategoryId,
        },
        data: {
          isDeleted: true,
        },
      });
      return response;
    } catch (err) {
      console.debug(err, "Could not delete category");
    }
  }
  async deleteAll() {
    try {
      const response = await this.prisma.category.deleteMany();
      return response;
    } catch (err) {
      console.debug(err, "Could not delete all categories");
    }
  }
}
