const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
var topic = `
Проанализируй сообщение, определи, профессионалом в чём ты являешься, Представься, как профессионал в этом, и укажи подробный ответ с учётом профессиональных навыков. Если пользователь просит написать код, присылай его. Имя специалиста - Дмитрий.

"Напиши код на node.js, демонстрирующий диалог пользователя с chat gpt через openai api с сохранением контекста."`;

const configuration = new Configuration({
  apiKey: 'API_KEY'
});
const openai = new OpenAIApi(configuration);

async function sendRequest(prompt) {
    const encoder = new TextEncoder();
const bytes = encoder.encode(prompt);
    let max_tokens = 4096 - parseInt(bytes.length);
    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt,
        temperature: 0.7,
        max_tokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
            let text = response.data.choices[0].text;
      let res = {text};
            if (response.data.stop) {
    res.stop = response.data.stop;
            }
      return res;
    }

    async function main() {
            let res = await sendRequest(topic);
      let article = res.text + `
/reset для сброса.`;
  if (res.stop) {
    console.log(res.stop);
  }
fs.writeFileSync(`${new Date().getTime()}.txt`, article);
  }
    main();
