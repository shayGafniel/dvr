import { UserCompany } from '../../gate/models/rails-data.model';

export interface  UserData {
  email?: string;
  id?: string;
  company?: UserCompany;
}
