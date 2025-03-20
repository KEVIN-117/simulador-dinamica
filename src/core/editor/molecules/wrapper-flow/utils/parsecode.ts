import { ManagerEnvsGraph } from "./ManagerEnvsGraph";

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
    ManagerEnvsGraph.updateVarsGraph(html);
    const plotlyObjects = getPlotlyCodeBlock(html);
    console.log(plotlyObjects);
    let code = ``;
    if (plotlyObjects) {
        plotlyObjects.forEach((plotlyObject: any) => {
            const { id } = plotlyObject;
            code += `const ${id.replace('-', '_')} = document.getElementById('${id}');`
        });
    }
    return code;
}

const detectBlockIndices = (code: string, functionName: string) => {
    const functionRegex = new RegExp(`${functionName}\\s*:\\s*(function\\s*\(.*\)|\(.*\)\\s*=>)\\s*{`);
    let startIndex = code.search(functionRegex);
    const endIndex = code.length;
    const subStartIndex = code.substring(startIndex, endIndex).indexOf('{');
    startIndex = startIndex + subStartIndex + 1;
    return { startIndex, endIndex };
}

const getEnvsInitGraphs = (html: string) => {
    const envs = ManagerEnvsGraph.getEnvs();
    let code = ``;
    envs.forEach((value, key) => {
        code += `this.${key} = ${value};`;
    });
    return code;
}

const getVarsGraph = (dataPlotly: string) => {
    const data = dataPlotly.match(/[\w\-]+\s*\,\s*[\w\-]+\,*\s*[\w\-]+/g);
    if (data) {
        return data.map((d: string) => {
            return d.split(',');
        });
    } else {
        throw Error('Error in data-plotly attribute, plese use the format [key, value]');
    }
}

const renderPlotly = (html: string) => {
    const plotlyObjects = getPlotlyCodeBlock(html);
    let code = ``;
    if (plotlyObjects) {
        plotlyObjects.forEach((plotlyObject: any) => {
            const { id, dataPlotly } = plotlyObject;
            const [x, y] = getVarsGraph(dataPlotly);
            
            code += `const dataPlotly_${id} = [{x: ${x}, y: ${y}, mode: 'lines', type: 'scatter'}];`;
            code += `Plotly.react('${id}', dataPlotly_${id}, {title: "a title"});`
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
  

export { getBaseCodeBlock, getPlotlyCodeBlock, initPlotly, getVarsGraph, getEnvsInitGraphs, renderPlotly, detectBlockIndices};