import { Configuration, OpenAIApi }  from 'openai';

const configuration = new Configuration({
    apiKey: 'API-KEY',
  });


  
  


export const sendMessage = async () => {
  try{const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Say this is a test",
    max_tokens: 7,
    temperature: 0,
  });
  console.log(response);}
  catch(e:any){
    console.error(e);
    
  }
  };

