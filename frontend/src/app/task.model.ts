export interface Task {
    _id: any;
    title: string;
    priority: string;
    description?: string;
    due_date?: Date;
    owner?: string;
    assigned_to?: string;
    status?: string;
    category?: string;
    participants?: string[];
    comments?: string[];
    attachments?: string[];
  }
  