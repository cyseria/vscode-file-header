const vscode = require('vscode');

function formatDate(date, fmt) {
    if (!date) return '';
    if (!fmt) fmt = 'yyyy-MM-dd HH:mm:ss';
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(),      //日
        "h+": date.getHours(),     //小时
        "H+": date.getHours(),     //小时
        "m+": date.getMinutes(),   //分
        "s+": date.getSeconds()    //秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}

const stringConfig = {
    lastModifyUser: {
        desc: '@last modified by:',
        range: null,
        value: ''
    },
    lastModifyTime: {
        desc: '@last modified time:',
        range: null,
        value: ''
    }
}

// 初始化模板
function compileFileHeader(config) {
    var line = "/**\n";
    line += " * @file\n";
    line += ` * @author ${config.author} <${config.email}>\n`;
    line += ` * @created time: ${config.createTime}\n`;
    line += ` * ${stringConfig.lastModifyUser.desc} ${config.author}\n`;
    line += ` * ${stringConfig.lastModifyTime.desc} ${config.lastModifyTime}\n`;
    line += " */\n\n";
    return line;
};


function activate(context) {
    var config = vscode.workspace.getConfiguration('fileheader');

    // when file init
    let disposable = vscode.commands.registerCommand('extension.addFileHeader', function () {
        var editor = vscode.window.activeTextEditor;

        if (!editor) {
            vscode.window.showErrorMessage("No open files, please open a file to add header!");
            return; // No open text editor
        }

        editor.edit(function (editBuilder) {
            try {
                const time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
                const data = {
                    author: config.custom.author || 'your name',
                    email: config.custom.email || 'your email',
                    createTime: time,
                    lastModifyTime: time
                }
                editBuilder.insert(new vscode.Position(0, 0), compileFileHeader(data));
            } catch (error) {
                console.error(error);
            }
        });
    });

    // when save
    vscode.workspace.onDidSaveTextDocument(function (file) {
        console.log('save')
        setTimeout(function () {
            try {
                const editor = vscode.window.activeTextEditor;
                const document = editor.document;
                const lineCount = document.lineCount;

                let diff = 0; // 相差的时间（15s 之内的修改才会存下来）

                for (let i = 0; i < lineCount; i++) {
                    const linetAt = document.lineAt(i);
                    let line = linetAt.text.trim();
                    for (let key in stringConfig) {
                        const data = stringConfig[key];
                        if (line.indexOf(data.desc) > -1) {
                            data.range = linetAt.range;
                            switch (key) {
                                case 'lastModifyTime':
                                    const time = line
                                        .replace(data.desc, "")
                                        .replace("*", "")
                                        .replace(" ", "");
                                    const curTIme = new Date();
                                    const oldTime = new Date(time);
                                    diff = (curTIme.getTime() - oldTime.getTime()) / 1000;
                                    data.text = ` * ${data.desc} ${formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')}`;
                                    break;
                                case 'lastModifyUser':
                                    data.text = ` * ${data.desc} ${config.custom.author}`;
                                    break;
                            }
                        }
                    }
                }

                let savetime = 10;
                if (!!config.saveTime) {
                    savetime = config.saveTime;
                }

                if (diff > savetime) {
                    setTimeout(function () {
                        editor.edit(function (edit) {
                            for (let key in stringConfig) {
                                const data = stringConfig[key];
                                if (!!data.range) {
                                    edit.replace(data.range, data.text);
                                    data.range = null;
                                }
                                
                            }
                        });
                        document.save();
                    }, 200);
                }
            } catch (error) {
                console.error(error);
            }
        }, 200);
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;