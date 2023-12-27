export interface Task {
    _id: any;
    title: string;
    priority: string;
    description?: string;
    due_date?: Date;
    owner?: string;
    status?: string;
    category?: string;
    participants?: string[];
    comments?: string[];
    attachments?: string[];
  }
  