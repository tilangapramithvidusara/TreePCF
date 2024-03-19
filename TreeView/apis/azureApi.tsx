import axios from 'axios';
  
  export const getCurrentNodeById =  async(_payload :any) => {
   
 try{

    console.log("curretNodeData ",_payload);
    const url = await window.parent.Xrm.Utility.getGlobalContext().getClientUrl();
    const language = await window.parent.Xrm.Utility.getGlobalContext().userSettings.languageId
    const webResourceUrl = `${url}/WebResources/gyde_surveybukactionsettings.json`;

    try {
      const response = await fetch(`${webResourceUrl}`);
      console.log("response",response);
      
      const data = await response.text();
      console.log("data",data, typeof data );

      const jsonObject = JSON.parse(data);
  console.log("jsonObject",jsonObject);
  
      // Retrieve the value of Gyde365Survey/SurveyTreeAzureFunctionUrl
      const surveyTreeAzureFunctionUrl = jsonObject["Gyde365Survey/SurveyTreeAzureFunctionUrl"];
      
      console.log("surveyTreeAzureFunctionUrl",surveyTreeAzureFunctionUrl);
   
      const result = await axios.post(surveyTreeAzureFunctionUrl,_payload)     
      console.log("result",result);
      console.log("APi Azure",result,result?.data?.Value);
      console.log("APi Azure1",JSON.parse(result?.data?.Value));
      return {type:'Success',data:JSON.parse(result?.data?.Value)}
  
    } catch (error) {
      console.error('Error loading data:', error);
    }
 }catch(e){
    console.log("error current node",e,_payload)
 }
    
}