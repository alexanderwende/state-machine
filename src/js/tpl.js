var config = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    scopeName: 'scope'
};

function compile (template) {

    var matcher = new RegExp([
        config.interpolate.source,
        config.evaluate.source
    ].join('|') + '|$', 'g');

    var code = '',
        index = 0;

    template.replace(matcher, function (match, interpolate, evaluate, offset) {

        code += template.slice(index, offset)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t');

        if (interpolate) {
            code += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }

        if (evaluate) {
            code += "';\n" + evaluate + "\n__p+='";
        }

        index = offset + match.length;

        return match;
    });

    code = "try{\nvar __p='',__t;\n__p+='" + code + "';\nreturn __p;\n}catch(e){throw new Error('Template error.')}";

    return 'export default function template (' + config.scopeName + ') {' + code + '};';
}

function render (template, data) {

    if (typeof template === 'string') {
        template = compile(template);
    }

    // TODO: compile into function vs module
}

function translate (load) {

    load.source = compile(load.source);
}

export {config, compile, translate};
