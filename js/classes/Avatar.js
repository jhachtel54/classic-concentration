class Animation
{
    static END_EVENT_NAME = "end";
    
    constructor(name, frameLengths, frameSequence)
    {
        this.name = name;
        this.frameLengths = frameLengths;
        this.frameSequence = frameSequence;
        this.Reset();
    }
    
    Update(deltaTime)
    {
        if (this.currentFrame < this.frameLengths.length)
        {
            this.currentDuration += deltaTime;
            if (this.currentDuration >= this.frameLengths[this.currentFrame])
            {
                ++this.currentFrame;
                if (this.currentFrame == this.frameLengths.length)
                {
                    return Animation.END_EVENT_NAME;
                }
                else
                {
                    this.currentDuration = 0;
                    return this.GetCurrentFrameName();
                }
            }
        }
        return null;
    }
    
    Reset()
    {
        this.currentFrame = this.currentDuration = 0;
    }
    
    GetCurrentFrameName()
    {
        return this.name + this.frameSequence[this.currentFrame];
    }
}

class Avatar
{
    constructor(gender, number, name)
    {
        this.gender = gender;
        this.number = number;
        this.name = name.toLowerCase();
        
        this.idleAnimation = new Animation("Idle", [], [""]);
        this.lookAnimation = new Animation("Look", [400, 400], [1, 2]);
        this.cheerAnimation = new Animation("Cheer", [266, 400, 400, 266, 650], [1, 2, 3, 2, 1]);
        this.wrongAnimation = new Animation("Wrong", [266, 200, 266, 266, 733], [1, 2, 3, 4, 3]);
        
        this.currentAnimation = this.idleAnimation;
        this.onEnd = null;
    }
    
    SetState(state, onEnd)
    {
        switch (state.toUpperCase())
        {
            case "IDLE":
                this.currentAnimation = this.idleAnimation;
                break;
            case "LOOK":
                this.currentAnimation = this.lookAnimation;
                break;
            case "CHEER":
                this.currentAnimation = this.cheerAnimation;
                break;
            case "WRONG":
                this.currentAnimation = this.wrongAnimation;
                break;
            default:
                return null;
        }
        this.currentAnimation.Reset();
        if (onEnd != null)
            this.onEnd = onEnd;
        else
            this.onEnd = null;
        return this.GetCurrentFrameName();
    }
    
    UpdateAnimation(deltaTime)
    {
        var newFrame = this.currentAnimation.Update(deltaTime);
        if (newFrame != null && newFrame != Animation.END_EVENT_NAME)
            return this.GetCurrentFrameName();
        if (newFrame == Animation.END_EVENT_NAME)
            this.onEnd();
        return newFrame;
    }
    
    GetCurrentFrameName()
    {
        return this.gender + this.number + this.currentAnimation.GetCurrentFrameName();
    }
}