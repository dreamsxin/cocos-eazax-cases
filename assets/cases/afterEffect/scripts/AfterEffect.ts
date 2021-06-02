const { ccclass, property, executionOrder, executeInEditMode } = cc._decorator;

/**
 * 后期特效
 * @see AfterEffect.ts https://gitee.com/ifaswind/eazax-cases/blob/master/assets/cases/afterEffect/scripts/AfterEffect.ts
 * @version 20210602
 */
@ccclass
@executionOrder(-10)
@executeInEditMode
export default class AfterEffect extends cc.Component {

    @property({ type: cc.Camera, tooltip: CC_DEV && '主摄像机' })
    protected camera: cc.Camera = null;

    @property({ type: cc.Sprite, tooltip: CC_DEV && '画面输出精灵' })
    protected targetSprite: cc.Sprite = null;

    /** 目标纹理 */
    protected targetTexture: cc.RenderTexture = null;

    protected onLoad() {
        this.init();
    }

    /**
     * 初始化
     */
    protected init() {
        // 创建 RenderTexture
        const texture = this.targetTexture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);

        // 将摄像机的内容渲染到目标纹理上
        this.camera.targetTexture = texture;

        // 使用目标纹理生成精灵帧
        const spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        // 设置到精灵上
        this.targetSprite.spriteFrame = spriteFrame;

        // Y 翻转
        // texture.setFlipY(true);  // not working
        const scale = Math.abs(this.targetSprite.node.scaleY);
        this.targetSprite.node.scaleY = -scale;
    }

}
