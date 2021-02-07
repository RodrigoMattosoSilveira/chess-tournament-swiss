export class Utils {
	/**
	 * Helper function to patch a USER and return the response object
	 * @param agent
	 * @param url
	 * @param patch
	 * @return response
	 */
	public patchEntity = async (agent: any, url: string, patch: any): Promise<any> => {
		// console.log ('Utils.patchEntity/url: ' + url);
		// console.log ('Utils.patchEntity/url: ' + JSON.stringify(patch));
		return await agent
			.patch(url)
			.send(patch)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200);
	}
}
