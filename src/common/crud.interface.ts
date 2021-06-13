export interface CRUD {
	list: (limit: number, page: number) => Promise<any>,
	create: (resource: any) => Promise<any>,
	readById: (resourceId: any) => Promise<any>,
	patchById: (resourceId: any) => Promise<any>,
	// not supported
	// updateById: (resourceId: any) => Promise<string>,
	// deleteById: (resourceId: any) => Promise<string>,
}
