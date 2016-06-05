# 超轻量级表单验证库   [![npm](https://img.shields.io/npm/v/tiny-validator.svg)](https://www.npmjs.com/package/tiny-validator)  [![npm](https://img.shields.io/npm/dt/tiny-validator.svg)](https://www.npmjs.com/package/tiny-validator)


## Install

```
npm install tiny-validator
```

## Usage

```
var validator = new Validator($('form'), {
    config: {
        'test1': {
            required: true,
            valid: /\w{3,}/,
            validTips: '最少输入3个字符'
        },
        'test2': {
            required: true
        }
    },
    handle: function(error, $el) {
        if(error) {
            $el.next().html(error.tips)
        } else {
            $el.next().html('')
        }
    }
})
```
## 配置参数

### config { Object }

验证规则配置对象

```
config: {
    //对应input,select或update的name属性
    'name': {
        //是否必须, boolean 
        required: true/false,
        //验证输入值的正则或要执行的验证函数（返回值为boolean）
        valid: /\w{3,}/,
        //required 为 false 时的提示信息，默认为: 该项为必填项
        requiredTips: '请输入 xxx',
        //valid 为 false 时的提示信息，默认为：您的输入不正确
        validTips: 'xxx 无效'
    },
    'name2': ...
}
```

### handle { Function }

对每个验证项验证后的回调函数。


回调的参数为：(error, $el)

## API

### valid()

根据 config 配置，验证表单，返回所有错误提示信息。

### isValid()

判断表单是否有效，返回 boolean。

### setTips(name, tips)

主动设置提示信息。

### destroy()

销毁表单验证组件实例。

