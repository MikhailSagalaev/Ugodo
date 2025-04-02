import { EntityManager } from "@mikro-orm/core";
import { Banner } from "../entities/banner";
import { BannerRepository } from "../repositories/banner.repository";
import { MedusaError } from "@medusajs/utils";

type CreateBannerInput = {
  title: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  image_url: string;
  display_order?: number;
  is_active?: boolean;
};

type UpdateBannerInput = Partial<CreateBannerInput>;

export default class BannerService {
  protected readonly manager_: EntityManager;

  constructor({ manager }) {
    this.manager_ = manager;
  }

  /**
   * Создает новый баннер.
   */
  async create(data: CreateBannerInput): Promise<Banner> {
    const banner = new Banner({
      ...data,
      is_active: data.is_active ?? true,
    });

    await this.manager_.getRepository(Banner).persistAndFlush(banner);
    return banner;
  }

  /**
   * Получает баннер по ID.
   */
  async retrieve(bannerId: string): Promise<Banner> {
    const banner = await BannerRepository.findById(this.manager_, bannerId);

    if (!banner) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Banner with id ${bannerId} not found`
      );
    }

    return banner;
  }

  /**
   * Обновляет баннер.
   */
  async update(bannerId: string, data: UpdateBannerInput): Promise<Banner> {
    const banner = await this.retrieve(bannerId);

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        banner[key] = data[key];
      }
    });

    await this.manager_.getRepository(Banner).persistAndFlush(banner);
    return banner;
  }

  /**
   * Удаляет баннер.
   */
  async delete(bannerId: string): Promise<void> {
    const banner = await this.retrieve(bannerId);

    await this.manager_.getRepository(Banner).removeAndFlush(banner);
  }

  /**
   * Получает активные баннеры.
   */
  async listActive(): Promise<Banner[]> {
    return BannerRepository.findActive(this.manager_);
  }

  /**
   * Получает список баннеров с пагинацией.
   */
  async list(
    filter: Partial<Banner> = {},
    options: { limit?: number; offset?: number } = {}
  ): Promise<[Banner[], number]> {
    return BannerRepository.find(this.manager_, filter, options);
  }
} 