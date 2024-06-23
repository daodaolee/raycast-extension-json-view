import { Action, ActionPanel, Form, Detail, useNavigation } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useRef } from "react";


function jsonToMarkdown(json: object) {
  const jsonString = JSON.stringify(json, null, 2); // 将 JSON 对象转换为格式化字符串
  return `\`\`\`json
${jsonString}
\`\`\``;
}

export default function Command() {
  // "https://jsonplaceholder.typicode.com/posts"
  const fetchUrl = useRef('')
  const { isLoading, data, revalidate } = useFetch(fetchUrl.current);
  const { push } = useNavigation();
 
  const handleSubmit = async (values: { url:string,jsontext: string }) => {
    let json = {}
    if(values.url && values.url.startsWith('http')){
      fetchUrl.current = values.url
      revalidate();
      json = data as object
    } else if(values.jsontext){
      json = JSON.parse(values.jsontext as string)
    }
    push(<Result json={json}/>)
  }
  const Entry = () => {
    return <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit Answer" onSubmit={(values) => handleSubmit(values as {url:string,jsontext:string})} />
        </ActionPanel>
      }>
      <Form.TextField
        id="url"
        title="url"
        placeholder="输入url"
      />
      <Form.TextArea id="jsontext" title="Json 文本" placeholder="请输入json文本" />
    </Form>
  }

  const Result = ({json}:{json:object}) => {
    return  <Detail markdown={jsonToMarkdown(json)}></Detail>;
  }

  return <Entry /> 
}
