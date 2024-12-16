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
        
        this.currentAnimation = this.idleAnimation;
    }
    
    SetState(state)
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
            default:
                return null;
        }
        this.currentAnimation.Reset();
        return this.GetCurrentFrameName();
    }
    
    UpdateAnimation(deltaTime)
    {
        var newFrame = this.currentAnimation.Update(deltaTime);
        if (newFrame != null && newFrame != Animation.END_EVENT_NAME)
            return this.GetCurrentFrameName();
        return newFrame;
    }
    
    GetCurrentFrameName()
    {
        return this.gender + this.number + this.currentAnimation.GetCurrentFrameName();
    }
}