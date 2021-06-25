export interface Role {
  id: number;
  name?: string;
  permissions?: Array<Permission>;
  permissions_string?: string;
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}
