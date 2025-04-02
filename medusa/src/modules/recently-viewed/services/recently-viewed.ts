import { EntityManager } from "@mikro-orm/core";
import { RecentlyViewed } from "../entities/recently-viewed";
import { RecentlyViewedRepository } from "../repositories/recently-viewed.repository";
import { MedusaError } from "@medusajs/utils";

type CreateViewInput = {
  product_id: string;
  customer_id?: string;
  session_id?: string;
};

export default class RecentlyViewedService {
  protected readonly manager_: EntityManager;
  protected readonly productService_: any;

  constructor({ manager, productService }) {
    this.manager_ = manager;
    this.productService_ = productService;
  }

  /**
   * Записывает просмотр товара.
   * Если для данного пользователя/сессии уже существует запись о просмотре,
   * то обновляется только время просмотра.
   */
  async recordView(data: CreateViewInput): Promise<RecentlyViewed> {
    // Требуется либо customer_id, либо session_id
    if (!data.customer_id && !data.session_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Either customer_id or session_id is required"
      );
    }

    // Проверяем существование товара
    await this.productService_.retrieve(data.product_id);

    // Добавляем запись просмотра, используя метод из репозитория
    return await RecentlyViewedRepository.addProductView(
      this.manager_,
      {
        product_id: data.product_id,
        customer_id: data.customer_id,
        session_id: data.session_id
      }
    );
  }

  /**
   * Получает список ID недавно просмотренных товаров для клиента.
   */
  async listProductIdsByCustomer(
    customerId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    return RecentlyViewedRepository.findProductIdsByCustomerId(
      this.manager_,
      customerId,
      options
    );
  }

  /**
   * Получает список ID недавно просмотренных товаров для сессии.
   */
  async listProductIdsBySession(
    sessionId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<string[]> {
    return RecentlyViewedRepository.findProductIdsBySessionId(
      this.manager_,
      sessionId,
      options
    );
  }

  /**
   * Получает записи просмотров для клиента.
   */
  async listByCustomer(
    customerId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[RecentlyViewed[], number]> {
    return RecentlyViewedRepository.findByCustomerId(
      this.manager_,
      customerId,
      options
    );
  }

  /**
   * Получает записи просмотров для сессии.
   */
  async listBySession(
    sessionId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<[RecentlyViewed[], number]> {
    return RecentlyViewedRepository.findBySessionId(
      this.manager_,
      sessionId,
      options
    );
  }

  /**
   * Связывает просмотры анонимных пользователей (session_id) с авторизованным клиентом (customer_id).
   */
  async mergeCustomerViews(customerId: string, sessionId: string): Promise<void> {
    // Получаем все просмотры для данной сессии
    const [sessionViews] = await this.listBySession(sessionId);

    // Для каждого просмотра создаем соответствующую запись для клиента
    for (const view of sessionViews) {
      await this.recordView({
        product_id: view.product_id,
        customer_id: customerId,
      });
    }

    // Удаляем записи для сессии
    // Так как в репозитории нет специального метода для удаления,
    // используем EntityManager напрямую
    await this.manager_.getRepository(RecentlyViewed).nativeDelete({ session_id: sessionId });
  }

  /**
   * Удаляет все записи просмотров для клиента или сессии.
   */
  async clear(customerId?: string, sessionId?: string): Promise<void> {
    if (!customerId && !sessionId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Either customer_id or session_id is required"
      );
    }

    if (customerId) {
      await this.manager_.getRepository(RecentlyViewed).nativeDelete({ customer_id: customerId });
    }

    if (sessionId) {
      await this.manager_.getRepository(RecentlyViewed).nativeDelete({ session_id: sessionId });
    }
  }
} 