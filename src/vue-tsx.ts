import { h, withDirectives, vModelDynamic, resolveDirective } from 'vue';

const predefinedDirectives: any = {
    'model': vModelDynamic
};

const dirReg = /(?:^v-([a-z0-9-]+))?(?:(?:\&|^@|^#)([^\.]+))?(.+)?$/i;

function parseMods(mods: string[]) {
    return mods.reduce((acc, mod) => {
        if (mod) {
            acc[mod.slice(1)] = true;
        }
        return acc;
    }, {} as Record<string, boolean>);
}

// @ts-ignore
globalThis.React = {
    createElement(el: string, ...children: any[]) {
        let props: any = null;
        const directives: any[] = [];

        if (children.length && children[0] && !children[0]._isVNode) {
            props = children[0];
            children = children.slice(1);
        }

        if (props !== null) {
            Object.keys(props)
                .forEach(key => {
                    if (key.startsWith('v-')) {
                        // @ts-ignore
                        const [,name, arg, ...mods] = dirReg.exec(key);
                        const mod = parseMods(mods);
                        const ref = props[key];
                        const predefined = predefinedDirectives[name];
                        delete props[key];

                        if (predefined) {
                            if (predefined === vModelDynamic) {
                                props[`onUpdate:${arg ? arg : 'modelValue'}`] = (v: any) => {
                                    ref.value = v;
                                }
                                directives.push([predefined, ref.value, arg, mod]);
                            } else {
                                directives.push([predefined, ref, arg, mod]);
                            }
                        } else {
                            const resolved = resolveDirective(name);
                            if (resolved) {
                                directives.push([resolved, ref, arg, mod]);
                            }
                        }
                    }
                })
        }

        const node = h(el, props, children);

        if (directives.length) {
            return withDirectives(node, directives);
        }

        return node;
    }
};