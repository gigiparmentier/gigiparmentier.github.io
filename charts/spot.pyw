import spotipy
import spotipy.util as util
import time
import json
import os
from datetime import datetime
import sys

scope = 'user-read-currently-playing'
sleeping_time = 10

def get_current_info(spotify):
    try:
        response = spotify.current_user_playing_track()
        artists = [(artist['name'],artist['external_urls']['spotify']) for artist in response['item']['artists']]
        song = (response['item']['name'],response['item']['external_urls']['spotify'],response['item']['album']['images'][0]['url'])
        progress = int(int(response['progress_ms']) / 1000)
        return (song,artists,progress)
    except spotipy.client.SpotifyException:
        return 'Token'
    except:
        return None

def store_data(info,username,spotify):
    current_song,current_artists,elapsed = info
    if os.path.isfile(username+'.json'):
        try:
            with open(username+'.json', 'r') as file:
                records = json.load(file)
        except:
            records = {'artists':[],'songs':[]}
    else:
        records = {'artists':[],'songs':[]}

    for current_artist in current_artists:
        artist_exists = False
        for record in records['artists']:
            if record['name'] == current_artist[0]:
                record['time'] += elapsed
                artist_exists = True
                break
        if not artist_exists:
            artist_query = spotify.search(q='artist:' + current_artist[0], type='artist')
            try:
                artist_info = artist_query['artists']['items'][0]
                genres = artist_info['genres']
                image = artist_info['images'][0]['url']
                records['artists'].append({'name':current_artist[0],'url':current_artist[1],'time':elapsed,'genres':genres,'image':image})
            except:
                records['artists'].append({'name':current_artist[0],'url':current_artist[1],'time':elapsed})

    song_exists = False
    for song in records['songs']:
        if song['name'] == current_song[0]:
            song['time'] += elapsed
            song_exists = True
            break
    if not song_exists:
        records['songs'].append({'name':current_song[0],'url':current_song[1],'time':elapsed,'image':current_song[2],'artist':current_artists[0][0]})

    with open(username+'.json', 'w') as file:
        json.dump(records, file, indent=2)
    return

def check_user(login_file):
    last_song = ''
    last_progress = 0
    with open(login_file,'r') as file:
        for line in file:
            if 'username' in line:
                username = line.split(':')[1].replace(' ','').replace('\n','')
            elif 'client_id' in line:
                client_id = line.split(':')[1].replace(' ','').replace('\n','')
            elif 'client_secret' in line:
                client_secret = line.split(':')[1].replace(' ','').replace('\n','')

    token = util.prompt_for_user_token(username, scope, client_id=client_id, client_secret=client_secret, redirect_uri='http://localhost/')
    spotify = spotipy.Spotify(auth=token)

    print('logged in as {}'.format(username))

    while True:
        elapsed = 0
        current_info = get_current_info(spotify)
        now = datetime.now().strftime('%H:%M:%S')
        if current_info == 'Token':
            token = util.prompt_for_user_token(username, scope, client_id=client_id, client_secret=client_secret, redirect_uri='http://localhost/')
            spotify = spotipy.Spotify(auth=token)
            print('{}> Relogging...'.format(now))
        elif current_info == None:
            print('{}> No song playing.'.format(now))
        elif len(current_info) == 3:
            if current_info[0][0] != last_song:#song has changed
                last_song = current_info[0][0]
                elapsed = current_info[2]
                print('{}>{}'.format(now,current_info[0][0]))
            else:
                if current_info[2] > last_progress:#not paused
                    elapsed = current_info[2] - last_progress
                    print('{}>{}'.format(now,current_info[0][0]))
                else:
                    print('{}> No change.'.format(now))
            store_data((current_info[0],current_info[1],elapsed),username,spotify)
            last_progress = current_info[2]
        time.sleep(sleeping_time)

check_user('{}.txt'.format(sys.argv[1]))
#check_user('marieline.txt')
#check_user('mathis.txt')
