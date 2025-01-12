import { useEffect } from "react";
import "./slider.css"

type changeFunctionType = (variables:Array<number>) => void;
type functionNoArrayString = () => Array<string | undefined>
type functionNoArrayNumber= () => Array<number | undefined>

interface Props{
    changeFunction: changeFunctionType
    labels: Array<string>
    changeSystemFunction: functionNoArrayString
    systemVariablesFunction: functionNoArrayString
    systemNAndVariables: functionNoArrayNumber
}

const Slider = ( props: Props ) =>{
    let labels = props.labels;
    const changeFunction = props.changeFunction;
    const changeSystemFunction = props.changeSystemFunction;
    const systemVariablesFunction = props.systemVariablesFunction;
    const systemNAndVariables = props.systemNAndVariables;

    let inputs: Array<HTMLInputElement> = [];
    let noSliders: number = labels.length;

    function addSliders(element: HTMLElement){
        const data = systemVariablesFunction();
        while(element.children.length){
            element.removeChild(element.children[0]);
        }

        inputs = [];

        let trow = document.createElement("tr");
        trow.id = "slider-system-name";
        element.appendChild(trow);
        trow.innerHTML = `<td colspan="2"><h2>&nbsp;&nbsp;&nbsp;&nbsp;${data[0]} system</h2></td>`;

        for(let i = 0; i<noSliders; i++){
            trow = document.createElement("tr");
            element.appendChild(trow);

            let tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            const label = document.createElement("label");
            label.innerHTML = labels[i]+" : ";
            tdat.appendChild(label);

            tdat = document.createElement("td");
            tdat.className="change-data-inner-td";
            trow.appendChild(tdat);
            const newChild = document.createElement("input");
            newChild.type = "number";
            newChild.className = "slider-input-class"
            newChild.placeholder = data[i+1] || "error";
            inputs.push(newChild);
            tdat.appendChild(newChild);
        }

        const secVariables = systemNAndVariables();
        trow = document.createElement("tr");
        trow.innerHTML = `<td class="change-data-inner-td">
                                    <label>n: </label>
                                </td>
                                <td class="change-data-inner-td">
                                    <input type="number" class="slider-input-class" id="slider-change-data-input-n" placeholder="${secVariables[0]}"/>
                                </td>`;
        element.appendChild(trow);
        trow = document.createElement("tr");
        trow.innerHTML = `<td class="change-data-inner-td">
                                    <label>epsilon: </label>
                                </td>
                                <td class="change-data-inner-td">
                                    <input type="number" class="slider-input-class" id="slider-change-data-input-epsilon" placeholder="${secVariables[1]}"/>
                                </td>`;
        element.appendChild(trow);
    }

    function runChangeFunction(){
        const variables = systemVariablesFunction();
        const values = [];

        const nElement = document.getElementById("slider-change-data-input-n") as HTMLInputElement;
        const epsilonElement = document.getElementById("slider-change-data-input-epsilon") as HTMLInputElement;

        let child: HTMLInputElement;
        for(child of inputs){
            values.push(Number(child.value));
            if(values[values.length-1] == 0) values[values.length-1] = Number(variables[values.length]);
        }

        const nAndEpsilon = systemNAndVariables();
        values.push(Number((nElement?.value || nAndEpsilon[0])));
        values.push(Number((epsilonElement?.value || nAndEpsilon[1])));

        changeFunction(values);
    }

    function changeSystem(){
        const variables = changeSystemFunction();
        noSliders = variables.length;
        labels = [];
        for(let i = 0; i<variables.length; i++){
            labels.push(variables[i] || "error");
        }
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
    }

    function loadNAndEpsilon(){
        const nElement = document.getElementById("slider-change-data-input-n") as HTMLInputElement;
        const epsilonElement = document.getElementById("slider-change-data-input-epsilon") as HTMLInputElement;

        const variables = systemNAndVariables();

        console.log(variables)
        if(nElement != null) nElement.placeholder = (variables[0] || "error").toString();
        if(epsilonElement != null) epsilonElement.placeholder = (variables[1] || "error").toString();
    }

    useEffect(() =>{
        const element = document.getElementById("slider-input-places-12334");
        if(element == null) throw("big big error");
        addSliders(element);
        loadNAndEpsilon();
    });

    return(<div className="slider-class">
        <center>
        <table>
            <tbody>
                <tr>
                    <td>
                        <table id="slider-input-places-12334"></table>
                        <button onClick={runChangeFunction}>simulate</button>
                        <button onClick={changeSystem} className="change-system-button-class">change system</button>
                    </td>
                    <td id="slider-info-inner-data"></td>
                </tr>
            </tbody>
        </table>
        </center>
    </div>);
};

export default Slider;