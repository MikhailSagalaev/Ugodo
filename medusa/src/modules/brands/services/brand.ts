import { Brand } from "../entities/brand";
import { EntityManager } from "typeorm";
import { MedusaError } from "medusa-core-utils";

type CreateBrandInput = {
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
};

type UpdateBrandInput = Partial<CreateBrandInput>;

export default class BrandService {
  private manager: EntityManager;

  constructor({ manager }) {
    this.manager = manager;
  }

  async create(data: CreateBrandInput): Promise<Brand> {
    const brandRepository = this.manager.getRepository(Brand);

    const brand = new Brand(data);
    return await brandRepository.save(brand);
  }

  async retrieve(brandId: string): Promise<Brand> {
    const brandRepository = this.manager.getRepository(Brand);
    const brand = await brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Brand with id: ${brandId} was not found`
      );
    }

    return brand;
  }

  async update(brandId: string, data: UpdateBrandInput): Promise<Brand> {
    const brandRepository = this.manager.getRepository(Brand);
    
    const brand = await this.retrieve(brandId);
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        brand[key] = value;
      }
    }

    return await brandRepository.save(brand);
  }

  async delete(brandId: string): Promise<void> {
    const brandRepository = this.manager.getRepository(Brand);
    const brand = await this.retrieve(brandId);
    await brandRepository.remove(brand);
  }

  async list(selector = {}, config = { skip: 0, take: 10 }): Promise<[Brand[], number]> {
    const brandRepository = this.manager.getRepository(Brand);
    
    const brands = await brandRepository.findAndCount({
      where: selector,
      skip: config.skip,
      take: config.take,
      order: { name: "ASC" },
    });

    return brands;
  }
} 