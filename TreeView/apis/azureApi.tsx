import axios from 'axios';
  
  export const getCurrentNodeById =  async(data :any) => {
   
 try{
    console.log("curretNodeData ",data);
    
    const result = await axios.post('https://designv2-fapp-uk-dv.azurewebsites.net/api/CreateSurveyTree?code=dTlMuN-mERzuiab6hFH68cXKWp6ob5DiDMET2wtZb-1lAzFuduMi8w==',data)     
    console.log("result",result);
    console.log("APi Azure",result,result?.data?.Value);
    console.log("APi Azure1",JSON.parse(result?.data?.Value));
    return {type:'Success',data:JSON.parse(result?.data?.Value)}
 }catch(e){
    console.log("error current node",e,data)
 }
    
}