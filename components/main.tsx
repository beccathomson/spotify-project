import {
  PlaylistDeduplicator,
  SavedTracksDeduplicator,
} from '../dedup/deduplicator';
import {
  PlaylistCreator
} from "../dedup/playlistCreator";
import { SpotifyTrackType, SpotifyUserType } from '../dedup/spotifyApi';
import { Translation, getI18n, useTranslation } from 'react-i18next';

import Badge from './badge';
import { DuplicateTrackList } from './duplicateTrackList';
import { DuplicateTrackListItem } from './duplicateTrackListItem';
import Panel from './panel';
import { PlaylistModel } from '../dedup/types';
import Process from '../dedup/process';
import React from 'react';
import { t } from 'i18next';

const Status = ({ toProcess }) => {
  const { t } = useTranslation();
  return (
    <span>
      <h3 className="text-xl font-bold mb-4">
        {toProcess > 0 || toProcess === null
          ? t('process.status.finding')
          : t('process.status.complete')}
      </h3>
    </span>
  );
};

type StateType = {
  toProcess?: number;
  playlists: Array<PlaylistModel>;
  savedTracks: {
    status?: string;
    unpopularSongs: Array<{
      index: number;
      reason: string;
      track: SpotifyTrackType;
    }>;
  };
  hasUsedSpotifyTop?: boolean;
  // selectedTracks: Array<SpotifyTrackType>; // needs to be a map????
  selectedTracks: Map<string, Array<SpotifyTrackType>>;
};

export const SAVED_SONGS_ID = "SAVED";

export default class Main extends React.Component<{
  api: any;
  user: SpotifyUserType;
  accessToken: string;
}> {
  state: StateType = {
    toProcess: null,
    playlists: [],
    savedTracks: {
      status: null,
      unpopularSongs: [],
    },
    selectedTracks: new Map(),
  };

  componentDidMount() {
    const process = new Process();
    process.on('updateState', (state) => {
      this.setState(state);
    });
    process.process(this.props.api, this.props.user);

    const hasUsedSpotifyTop = async () => {
      const res = await fetch(`https://spotify-top.com/api/profile`, {
        method: 'GET',
        headers: { 'Spotify-Auth': this.props.accessToken },
      });
      const data = await res.json();
      return data.hasUsedSpotifyTop;
    };

    try {
      hasUsedSpotifyTop()
        .then((result) => {
          this.setState({ hasUsedSpotifyTop: result === true });
        })
        .catch((e) => { });
    } catch (e) { }
  }

  createNewPlaylist = () => {
    PlaylistCreator.createPlaylistFromTracks(this.props.api, this.props.user.id, this.state.selectedTracks)
  }

  removeSelectedSongs(playlistId: string) {
    (async () => {
      await SavedTracksDeduplicator.removeSelectedSongs(
        this.props.api,
        this.state.selectedTracks,
        playlistId
      );
      this.setState({
        ...this.state,
        savedTracks: {
          unpopularSongs: [],
          status: 'process.items.removed',
        },
      });
      if (global['ga']) {
        global['ga'](
          'send',
          'event',
          'spotify-dedup',
          'saved-tracks-removed-duplicates'
        );
      }
    })();
  }

  render() {
    const totalSelected = this.state.selectedTracks.size;

    return (
      <div className="mx-4 md:mx-0">
        <Status toProcess={this.state.toProcess} />
        <Panel>
          {this.state.toProcess === null && (
            <Translation>{(t) => t('process.reading-library')}</Translation>
          )}
          {this.state.toProcess > 0 && (
            <Translation>
              {(t) => t('process.processing', { count: this.state.toProcess })}
            </Translation>
          )}
          {this.state.toProcess === 0 && totalSelected > 0 && (
            <span>
              <Translation>
                {(t) => t('process.status.complete.body')}
              </Translation>{' '}
              <Translation>
                {(t) => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('process.status.complete.dups.body', {
                        strongOpen: '<strong>',
                        strongClose: '</strong>',
                      }),
                    }}
                  />
                )}
              </Translation>
            </span>
          )}
          {this.state.toProcess === 0 && totalSelected === 0 && (
            <span>
              <Translation>
                {(t) => t('process.status.complete.body')}
              </Translation>
              <br />
              <Translation>
                {(t) => t('process.status.complete.nodups.body')}
              </Translation>
              {this.state.hasUsedSpotifyTop === false ? (
                <div>
                  <p>
                    <strong>
                      <Translation>
                        {(t) => t('spotifytop.heading')}
                      </Translation>
                    </strong>{' '}
                    <Translation>
                      {(t) => t('spotifytop.description')}
                    </Translation>{' '}
                    <strong>
                      <Translation>{(t) => t('spotifytop.check1')}</Translation>
                      ,{' '}
                      <a
                        href="https://spotify-top.com/?ref=spotifydedup"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Spotify Top
                      </a>
                    </strong>{' '}
                    <Translation>{(t) => t('spotifytop.check2')}</Translation>
                  </p>
                </div>
              ) : null}
            </span>
          )}
        </Panel>

        {this.state.toProcess === 0 && (
          <ul className="playlists-list">
            {(this.state.savedTracks.unpopularSongs.length ||
              this.state.savedTracks.status) && (
                <li className="playlists-list-item media">
                  <div className="img">
                    <img
                      width="100"
                      height="100"
                      className="playlists-list-item__img"
                      src={'./placeholder.png'}
                    />
                  </div>
                  <div className="bd">
                    <span className="playlists-list-item__name">
                      <Translation>{(t) => t('process.saved.title')}</Translation>
                    </span>
                    {this.state.savedTracks.status && (
                      <Badge>
                        <Translation>
                          {(t) => t(this.state.savedTracks.status)}
                        </Translation>
                      </Badge>
                    )}
                    {this.state.savedTracks.unpopularSongs.length != 0 && (
                      <span>
                        <span>
                          <Translation>
                            {(t) =>
                              t('process.saved.duplicates', {
                                count: this.state.savedTracks.unpopularSongs.length,
                              })
                            }
                          </Translation>
                        </span>
                        <button
                          className="btn btn-primary btn-sm playlist-list-item__btn"
                          onClick={() => this.removeSelectedSongs(SAVED_SONGS_ID)}
                        >
                          <label>
                            Remove selected songs from saved tracks
                          </label>
                        </button>
                        <button
                          className="btn btn-primary btn-sm playlist-list-item__btn"
                          onClick={() => this.createNewPlaylist()}
                        >
                          <label>
                            Create playlist from selected songs
                          </label>
                        </button>
                        <DuplicateTrackList>
                          {this.state.savedTracks.unpopularSongs.map(
                            (song, index) => (
                              <div key={index} className="itemWithCheckbox">
                                <DuplicateTrackListItem
                                  key={index}
                                  reason={song.reason}
                                  trackName={song.track.name}
                                  trackArtistName={song.track.artists[0].name}
                                />
                                <input value={song.track.uri} onChange={(e) => {
                                  let selectedSavedTracks = this.state.selectedTracks.get(SAVED_SONGS_ID) ?? [];
                                  const targetTrack = this.state.savedTracks.unpopularSongs.find((track) => track.track.uri === e.target.value);
                                  if (selectedSavedTracks?.includes(targetTrack.track))
                                    delete this.state.selectedTracks[targetTrack.track.id];
                                  else {
                                    const newMap = this.state.selectedTracks;
                                    newMap.set(SAVED_SONGS_ID, [...selectedSavedTracks, targetTrack.track]);
                                    this.state.selectedTracks.set(SAVED_SONGS_ID, [...selectedSavedTracks, targetTrack.track]);
                                    this.setState({ ...this.state, selectedTracks: newMap }); // this is super slow
                                  }

                                }} type="checkbox" />
                              </div>
                            )
                          )}
                        </DuplicateTrackList>
                      </span>
                    )}
                  </div>
                </li>
              )}
            {this.state.playlists
              .filter((p) => p.unpopularSongs.length || p.status != '')
              .map((playlist: PlaylistModel, index) => (
                <li className="playlists-list-item media" key={index}>
                  <div className="img">
                    <img
                      width="100"
                      height="100"
                      className="playlists-list-item__img"
                      src={
                        playlist.playlist.images &&
                        playlist.playlist.images[0] &&
                        playlist.playlist.images[0].url
                      }
                    />
                  </div>
                  <div className="bd">
                    <span className="playlists-list-item__name">
                      {playlist.playlist.name}
                    </span>
                    {playlist.status && (
                      <Badge>
                        <Translation>{(t) => t(playlist.status)}</Translation>
                      </Badge>
                    )}
                    {playlist.unpopularSongs.length != 0 && (
                      <span>
                        <span>
                          <Translation>
                            {(t) =>
                              t('process.playlist.duplicates', {
                                count: playlist.unpopularSongs.length,
                              })
                            }
                          </Translation>
                        </span>
                        <button
                          className="btn btn-primary btn-sm playlist-list-item__btn"
                          onClick={() => this.removeSelectedSongs(playlist.playlist.id)}
                        >
                          <label>
                            Remove selected songs from playlist
                          </label>
                        </button>
                        <DuplicateTrackList>
                          {playlist.unpopularSongs.map((duplicate, index) => (
                            <DuplicateTrackListItem
                              key={index}
                              reason={duplicate.reason}
                              trackName={duplicate.track.name}
                              trackArtistName={duplicate.track.artists[0].name}
                            />
                          ))}
                        </DuplicateTrackList>
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
        <style jsx>
          {`
            .bd {
              position: relative;
            }

            .media,
            .bd {
              overflow: hidden;
              _overflow: visible;
              zoom: 1;
            }

            .media .img {
              float: left;
              margin-right: 20px;
            }

            img {
              vertical-align: middle;
            }

            .playlists-list-item {
              margin-bottom: 2rem;
            }

            .playlists-list-item__img {
              width: 100px;
            }

            .btn {
              background-image: none;
              border: 1px solid transparent;
              border-radius: 4px;
              cursor: pointer;
              display: inline-block;
              font-size: 14px;
              font-weight: 400;
              line-height: 1.428571429;
              margin-bottom: 0;
              padding: 6px 12px;
              text-align: center;
              vertical-align: middle;
              white-space: nowrap;
            }

            .btn-primary {
              background-color: #428bca;
              border-color: #357ebd;
              color: #fff;
            }

            .btn-primary:hover {
              background-color: #5094ce;
            }

            .playlist-list-item__btn {
              max-width: 50%;
              position: absolute;
              right: 0;
              top: 0;
            }

            @media (max-width: 700px) {
              .playlist-list-item__btn {
                max-width: 100%;
                position: relative;
              }
            }

            .playlists-list-item__name {
              display: block;
              font-weight: bold;
              max-width: 50%;
            }

            ul {
              padding: 0;
            }

            .itemWithCheckbox {
              display:flex;
              justify-content: space-between;
            }
          `}
        </style>
      </div>
    );
  }
}
