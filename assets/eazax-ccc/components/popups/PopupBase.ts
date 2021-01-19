const { ccclass, property } = cc._decorator;

/**
 * 弹窗基类
 * @see PopupBase.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/components/popups/PopupBase.ts
 */
@ccclass
export default class PopupBase<Options = any> extends cc.Component {

    @property({ type: cc.Node, tooltip: CC_DEV && '背景遮罩' })
    public background: cc.Node = null;

    @property({ type: cc.Node, tooltip: CC_DEV && '弹窗主体' })
    public main: cc.Node = null;

    /** 用于拦截点击的节点 */
    protected blocker: cc.Node = null;

    /** 展示和隐藏动画的时长 */
    public animTime: number = 0.3;

    /** 弹窗选项 */
    protected options: Options = null;

    /** 弹窗流程结束回调（注意：该回调为 PopupManager 专用，重写 hide 函数时记得调用该回调） */
    protected finishCallback: Function = null;

    /**
     * 展示弹窗
     * @param options 弹窗选项
     */
    public show(options?: Options): void {
        // 储存选项
        this.options = options;
        // 重置节点
        this.background.opacity = 0;
        this.background.active = true;
        this.main.scale = 0;
        this.main.opacity = 0;
        this.main.active = true;
        // 开启节点
        this.node.active = true;
        // 初始化
        this.init(this.options);
        // 更新样式
        this.updateDisplay(this.options);
        // 播放动画
        const time = this.animTime;
        cc.tween(this.background)
            .to(time * 0.8, { opacity: 200 })
            .start();
        cc.tween(this.main)
            .to(time, { scale: 1, opacity: 255 }, { easing: 'backOut' })
            .call(() => {
                // 弹窗已完全展示（动画完毕）
                this.onShow && this.onShow();
            })
            .start();
    }

    /**
     * 隐藏弹窗
     */
    public hide(): void {
        // 拦截点击事件
        if (!this.blocker) {
            this.blocker = new cc.Node('blocker');
            this.blocker.addComponent(cc.BlockInputEvents);
            this.blocker.setParent(this.node);
            this.blocker.setContentSize(this.node.getContentSize());
        }
        this.blocker.active = true;
        // 播放动画
        const time = this.animTime;
        cc.tween(this.background)
            .delay(time * 0.2)
            .to(time * 0.8, { opacity: 0 })
            .call(() => {
                this.background.active = false;
            })
            .start();
        cc.tween(this.main)
            .to(time, { scale: 0, opacity: 255 }, { easing: 'backIn' })
            .call(() => {
                // 关闭拦截节点
                this.blocker.active = false;
                // 关闭节点
                this.main.active = false;
                this.node.active = false;
                // 弹窗已完全隐藏（动画完毕）
                this.onHide && this.onHide();
                // 弹窗完成回调（该回调为 PopupManager 专用）
                // 注意：重写 hide 函数时记得调用该回调
                this.finishCallback && this.finishCallback();
            })
            .start();
    }

    /**
     * 弹窗已完全展示（子类请重写此函数以实现自定义逻辑）
     */
    protected onShow(): void { }

    /**
     * 弹窗已完全隐藏（子类请重写此函数以实现自定义逻辑）
     */
    protected onHide(): void { }

    /**
     * 初始化（子类请重写此函数以实现自定义逻辑）
     */
    protected init(options: Options): void { }

    /**
     * 更新样式（子类请重写此函数以实现自定义样式）
     * @param options 弹窗选项
     */
    protected updateDisplay(options: Options): void { }

    /**
     * 设置弹窗完成回调（该回调为 PopupManager 专用）
     * @param callback 回调
     */
    public setFinishCallback(callback: Function): void {
        this.finishCallback = callback;
    }

}
