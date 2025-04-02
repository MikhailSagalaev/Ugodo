import { EntityManager } from "@mikro-orm/core";
import { Story } from "../entities/story";
import { StorySlide } from "../entities/story-slide";
import { StoryRepository } from "../repositories/story.repository";
import { StorySlideRepository } from "../repositories/story-slide.repository";
import { MedusaError } from "@medusajs/utils";

type CreateStoryInput = {
  title: string;
  icon_url: string;
  icon_background_color?: string;
  display_order?: number;
  is_active?: boolean;
  slides?: CreateStorySlideInput[];
};

type CreateStorySlideInput = {
  image_url: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  display_order?: number;
  is_active?: boolean;
};

type UpdateStoryInput = Partial<Omit<CreateStoryInput, 'slides'>>;

type UpdateStorySlideInput = Partial<CreateStorySlideInput>;

export default class StoryService {
  protected readonly manager_: EntityManager;

  constructor({ manager }) {
    this.manager_ = manager;
  }

  /**
   * Создает новую историю.
   */
  async create(data: CreateStoryInput): Promise<Story> {
    const story = new Story({
      title: data.title,
      icon_url: data.icon_url,
      icon_background_color: data.icon_background_color,
      display_order: data.display_order,
      is_active: data.is_active ?? true,
    });

    // Сохраняем историю
    await this.manager_.getRepository(Story).persistAndFlush(story);

    // Если есть слайды, создаем их
    if (data.slides && data.slides.length > 0) {
      await this.addSlides(story.id, data.slides);
    }

    return this.retrieve(story.id);
  }

  /**
   * Получает историю по ID.
   */
  async retrieve(storyId: string): Promise<Story> {
    const story = await StoryRepository.findById(this.manager_, storyId);

    if (!story) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Story with id ${storyId} not found`
      );
    }

    return story;
  }

  /**
   * Обновляет историю.
   */
  async update(storyId: string, data: UpdateStoryInput): Promise<Story> {
    const story = await this.retrieve(storyId);

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        story[key] = data[key];
      }
    });

    await this.manager_.getRepository(Story).persistAndFlush(story);
    return story;
  }

  /**
   * Удаляет историю.
   */
  async delete(storyId: string): Promise<void> {
    const story = await this.retrieve(storyId);

    await this.manager_.getRepository(Story).removeAndFlush(story);
  }

  /**
   * Получает активные истории.
   */
  async listActive(): Promise<Story[]> {
    return StoryRepository.findActive(this.manager_);
  }

  /**
   * Получает список историй с пагинацией.
   */
  async list(
    filter: Partial<Story> = {},
    options: { limit?: number; offset?: number } = {}
  ): Promise<[Story[], number]> {
    return StoryRepository.find(this.manager_, filter, options);
  }

  /**
   * Добавляет слайды к истории.
   */
  async addSlides(storyId: string, slides: CreateStorySlideInput[]): Promise<StorySlide[]> {
    const story = await this.retrieve(storyId);
    
    const storySlides = slides.map((slideData, index) => {
      return new StorySlide({
        story_id: storyId,
        image_url: slideData.image_url,
        title: slideData.title,
        description: slideData.description,
        button_text: slideData.button_text,
        button_link: slideData.button_link,
        display_order: slideData.display_order !== undefined ? slideData.display_order : index,
        is_active: slideData.is_active ?? true,
      });
    });

    await this.manager_.getRepository(StorySlide).persistAndFlush(storySlides);
    
    return storySlides;
  }

  /**
   * Обновляет слайд истории.
   */
  async updateSlide(slideId: string, data: UpdateStorySlideInput): Promise<StorySlide> {
    const slide = await StorySlideRepository.findById(this.manager_, slideId);

    if (!slide) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Story slide with id ${slideId} not found`
      );
    }

    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        slide[key] = data[key];
      }
    });

    await this.manager_.getRepository(StorySlide).persistAndFlush(slide);
    return slide;
  }

  /**
   * Удаляет слайд истории.
   */
  async deleteSlide(slideId: string): Promise<void> {
    const slide = await StorySlideRepository.findById(this.manager_, slideId);

    if (!slide) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Story slide with id ${slideId} not found`
      );
    }

    await this.manager_.getRepository(StorySlide).removeAndFlush(slide);
  }

  /**
   * Получает слайды истории.
   */
  async getSlides(storyId: string): Promise<StorySlide[]> {
    return StorySlideRepository.findByStoryId(this.manager_, storyId);
  }
} 