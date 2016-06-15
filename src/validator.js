/**
 * 公用验证组件
 * @author petermu
 */
!function(factory){
    // amd || cmd
    if(typeof define == 'function' && (define.cmd || define.amd)){
        define(['jquery'], function($){
            return factory($)
        })
    }else{
        if(window.jQuery){
            var ret = factory(window.jQuery)
            window.Validator = ret
        }else{
            console && console.error('U need to load jquery!')
        }
    }
}(function(jQuery){
    var $ = jQuery 

    var Validator = function(el, opts) {
        this.errors = []
        this.$el = $(el)
        this.opts = opts || {}
        this.opts = $.extend({
            config: {},
            handle: $.noop
        }, opts)
        this.init()
        this.validateAll()
    }

    Validator.prototype.init = function() {
        var that = this
        this.$el.on('blur', 'input,select,textarea', function(e) {
            var $target = $(e.currentTarget)
            that._doValid($target, true)
        })
        this.$el.on('keyup', 'input,textarea', function(e) {
            var $target = $(e.currentTarget)
            if(that._hasError($target.attr('name')) && that._doValid($target, false)) {
                that.opts.handle(null, $target)
            }
        })
        this.$el.on('change', 'select', function(e) {
            var $target = $(e.currentTarget)
            if(that._hasError($target.attr('name')) && that._doValid($target, false)) {
                that.opts.handle(null, $target)
            }
        })
    }

    Validator.prototype.validateAll = function(show) {
        var config = this.opts.config
        this.errors = []
        show = show || false
        for(var key in config) {
            this._doValid(this.get(key).$el, show)
        }
    }

    Validator.prototype.get = function(name) {
        var $target = this.$el.find('[name=' + name + ']')
        return {
            $el: $target,
            value: this.getValue($target)
        }
    }

    Validator.prototype.getValue = function($el) {
        if($el.is('input[type=checkbox]') || $el.is('input[type=radio]')) {
            return this.$el.find('input[name="' + $el.attr('name') + '"]:checked').val()
        } else {
            return $el.val()
        }
    }

    Validator.prototype._doValid = function($target, show) {
        var flag = true 
        if(!$target.is(':hidden')) {
            var name = $target.attr('name')
            var value = this.getValue($target)
            var config = this.opts.config[name]
            show = show || false
            if(config && config.required) {
                if(!value) {
                    flag = false
                    this._setError(name, false, 'required', show, config)
                    //验证为空时，返回，没必要继续做valid验证
                    return flag 
                } else {
                    this._setError(name, true, 'required', show, config)
                    flag = true 
                }
            }
            if(config && config.valid) {
                if(config.valid instanceof RegExp) {
                    flag = config.valid.test(value)
                    this._setError(name, flag, 'valid', show, config)
                }

                if(config.valid instanceof Function) {
                    flag = config.valid(value)
                    this._setError(name, flag, 'valid', show, config)
                }
            }
        }
        return flag
    }

    Validator.prototype.parseError = function($el, name, type, config) {
        var error = {
            $el: $el,
            name: name 
        }
        if(type == 'required') {
            error.tips = config.requiredTips || '该项为必填项'
        }
        if(type == 'valid') {
            error.tips = config.validTips || '您的输入不正确'
        }
        return error
    }

    Validator.prototype._setError = function(name, isValid, type, show, config) {
        var $el = this.get(name).$el
        var error = this._hasError(name)
        if(error) {
            if(isValid) {
                error = null
            } else {
                error = this.parseError($el, name, type, config)
            }
        } else {
            if(!isValid) {
                error = this.parseError($el, name, type, config)
                this.errors.push(error)
            }
        }
        show && this.opts.handle(error, $el)
    }

    Validator.prototype._hasError = function(name) {
        var error = null
        for(var i=0,l=this.errors.length; i<l; i++) {
            if(this.errors[i].name == name) {
                error = this.errors[i]
                break
            }
        }
        return error
    }

    Validator.prototype.valid = function() {
        var ret = []
        this.validateAll(true)
        for(var i=0,l=this.errors.length; i<l; i++) {
            this.errors[i] && ret.push(this.errors[i])
        }
        return ret
    }

    Validator.prototype.isValid = function() {
        return this.valid().length == 0
    }

    Validator.prototype.setTips = function(name, tips) {
        var $el = this.get(name).$el
        var error = {
            $el: $el,
            name: name,
            tips: tips
        }
        this.errors.push(error)
        this.opts.handle(error, $el)
    }

    Validator.prototype.destroy = function() {
        this.$el.off()
    }

    Validator.prototype.getData = function() {
        var data = {}, $el = null
        var array = this.$el.find('input,textarea,select')
        for(var i=0,l=array.length; i<l; i++) {
            $el = $(array[i])
            data[$el.attr('name')] = this.getValue($el)
        }
        return data
    }

    return Validator
})

