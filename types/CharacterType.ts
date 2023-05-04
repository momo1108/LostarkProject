export type CharRecentBlockParams = {
  names: string[];
};

export type CharSearchBarParams = {
  search: (name: string) => void;
  loading: boolean;
  names: string[];
};

export type CharRecentContainerParams = {
  names: string[];
};
