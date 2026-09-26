export type ToolCategory = 'text' | 'utility' | 'image' | 'pdf' | 'dev' | 'ai';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  description: string;
  iconName: string;
  isImplemented: boolean;
  popular?: boolean;
  tags: string[];
  features: string[];
  howToUse: string[];
  faqs: ToolFaq[];
  relatedToolIds: string[];
  statusNote?: string;
}
