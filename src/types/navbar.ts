export interface IDropDownMenu {
  title: string;
  path: string;
  children?: IDropDownMenu[];
}

export interface IBrandWithImage {
  id: string;
  name: string;
  slug: string;
  logo: string;
}
