export const changeRequestType = ['MENU', 'MENU_DETAIL', 'STAFF_LIST'] as const;
export type ChangeRequestType = (typeof changeRequestType)[number];

export const changeRequestStatus = ['DRAFT', 'ACCEPTED', 'REJECTED'] as const;
export type ChangeRequestStatus = (typeof changeRequestStatus)[number];
