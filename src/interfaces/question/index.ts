import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface QuestionInterface {
  id?: string;
  question_text: string;
  answer_text: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  _count?: {};
}

export interface QuestionGetQueryInterface extends GetQueryInterface {
  id?: string;
  question_text?: string;
  answer_text?: string;
  organization_id?: string;
}
