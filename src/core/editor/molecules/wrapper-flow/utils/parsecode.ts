const getBaseCodeBlock = (codeString: string) => {
    const firstIndex = codeString.indexOf('{');
    const lastIndex = codeString.lastIndexOf('}');
    return codeString.substring(firstIndex, lastIndex + 1);
}
// search if the htmlcode exits in this format
// <div id='plotly-1' class='plotly' data-plotly='data'></div>
const getPlotlyCodeBlock = (html: string) => {
    const expression = /<div\s+id=['\"].+['\"]\s+class=['\"]plotly['\"][^>]*>.*?<\/div>/g;
    const matches = html.match(expression);
    if (matches) {
        return  matches.map(extractPlotlyAttributes);
    }
    return null;
}

const initPlotly = (html: string) => {
    const plotlyObjects = getPlotlyCodeBlock(html);
    let code = ``;
    if (plotlyObjects) {
        plotlyObjects.forEach((plotlyObject: any) => {
            const { id } = plotlyObject;
            code += `const ${id.replace('-', '_')} = document.getElementById('${id}');`
        });
    }
    return code;
}

const extractPlotlyAttributes = (htmlString: string) => {
    const regex = /<div\s+id=['"]([^'"]+)['"]\s+class=['"]([^'"]+)['"]\s+data-plotly=['"]([^'"]+)['"][^>]*>/;
    const match = htmlString.match(regex);
  
    if (!match) return null; // Si no hay coincidencia, retorna null
  
    return {
      id: match[1],
      class: match[2],
      dataPlotly: match[3]
    };
  }
  

export { getBaseCodeBlock, getPlotlyCodeBlock, initPlotly };