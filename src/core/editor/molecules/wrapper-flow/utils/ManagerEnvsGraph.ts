import { getVarsGraph } from './parsecode';

class ManagerEnvsGraph {
    static mapVars = new Map();
    static updateVarsGraph(dataPlotly: string) {
        const plotyVars = getVarsGraph(dataPlotly);
        plotyVars.forEach((vars) => {
            vars.forEach((v) => {
                ManagerEnvsGraph.mapVars.set(`${v}_data`, '[]');
            })
        });
    }
    static getEnvs() {
        if (ManagerEnvsGraph.mapVars.size === 0) {
            throw new Error('No vars in the graph please update the envs first');
        }
        return ManagerEnvsGraph.mapVars;
    }
}
export { ManagerEnvsGraph };