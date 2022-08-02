# How To Create An ENgrid Page on Engaging Networks

1. Open your Web Console in your EN Dashboard page and paste this code:
`document.cookie.split(";").filter(e => e.trim().includes("en_dashboardId="))[0].split("=")[1]`    
The output is your dashboard ID.
2. Take the Page ID you want to change.
3. Open Insomnia and create a new PUT request to `https://us.engagingnetworks.app/ea-dataservice/rest/campaignpage/{PAGE_ID}/design` . Change the server from `us` to `ca` if necessary.
4. Still on Insomnia, go to the HEADER tab and add those Key => Values:
    - Content-Type => `application/json; charset=utf-8`
    - Accept => `application/json, text/javascript, */*; q=0.01`
    - Host => `us.engagingnetworks.app` (or `ca`)
    - token => `{YOUR_DASHBOARD_ID}`
5. The first tab on Insomnia should be set as JSON. Copy the content from this link and paste on Insomnia: https://raw.githubusercontent.com/4site-interactive-studios/engrid-scripts/main/reference-materials/scripts/engrid.json
6. Hit Send (Make Sure it’s a `PUT` request). If you see `"status": "success"` as a result, you’ve just created 2 ENgrid Pages (Donation Form + Thank You) on the Page ID defined on step 3.