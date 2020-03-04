import { VNode } from "vue";

declare global {
    namespace React {
        function createElement(el: string, ...children: any[]): JSX.Element;
    }

    namespace JSX {
        interface Element extends VNode {}
        interface ElementAttributesProperty {
            vModel: any;
        }
    }
}