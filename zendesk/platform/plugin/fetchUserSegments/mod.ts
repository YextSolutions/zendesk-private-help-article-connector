declare const zendeskSubdomain: string;
declare const zendeskUsername: string;
declare const zendeskPassword: string;

//converting basic auth to bit64 to pass in header
const basicAuthEnconded = btoa(`${zendeskUsername}:${zendeskPassword}`);
const myHeaders = new Headers();
myHeaders.append("Authorization", `Basic ${basicAuthEnconded}`);
const requestOptions = {
  method: 'GET',
  headers: myHeaders,
};

export const fetchHelpCenterContent = async (segmentId: string) => {
    if (segmentId === "") {
      return "";
    };
    const segmentResponse = await fetchPermissions(segmentId);
    if (segmentResponse !== 200) {
      return "";
    };
    const segment = segmentResponse.user_segment;
    const groups = segment.group_ids;
    const organizations = segment.organization_ids;
    const tags = segment.tags;
    const orTags = segment.or_tags;
    const identitiesArray = [...groups, ...organizations, ...tags, ...orTags];
    let identitiesList = "";
    identitiesArray.forEach(identity => identitiesList += `,${identity}`);
    return identitiesList.substring(1);
}

const fetchPermissions = async (segmentId: string) => await fetch(`https://${zendeskSubdomain}.zendesk.com/api/v2/help_center/user_segments/${segmentId}`, requestOptions).then(response => parseApiResponse(response));
const parseApiResponse = (response: Response) => {
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 429) {
        return response.status;
    }
}