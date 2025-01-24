class AudioTrack
{
    constructor(name, file)
    {
        this.name = name;
        this.audio = new Audio(file);
    }
}

class AudioPlayer
{
    static tracks = [
        new AudioTrack("correct", "audio/correct.mp3"),
        new AudioTrack("fanfare", "audio/fanfare.mp3"),
        new AudioTrack("intro", "audio/intro.mp3"),
        new AudioTrack("prompt", "audio/prompt.mp3"),
        new AudioTrack("reset", "audio/reset.mp3"),
        new AudioTrack("select", "audio/select.mp3"),
        new AudioTrack("transition", "audio/transition.mp3"),
        new AudioTrack("wrong", "audio/wrong.mp3"),
    ]
    
    static SetVolume(volume)
    {
        // The volume is way too loud at 100%, so half it
        var halfVolume = volume * 0.5;
        this.tracks.forEach(track => { track.audio.volume = halfVolume; });
    }
    
    static Play(name)
    {
        for (var index = 0; index < this.tracks.length; ++index)
        {
            var track = this.tracks[index];
            if (track.name == name)
            {
                track.audio.play();
                return;
            }
        }
    }
    
    static Stop(name)
    {
        for (var index = 0; index < this.tracks.length; ++index)
        {
            var track = this.tracks[index];
            if (track.name == name)
            {
                track.audio.pause();
                track.audio.currentTime = 0;
                return;
            }
        }
    }
}