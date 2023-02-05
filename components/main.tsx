import {
  SavedTracksDeduplicator,
} from '../dedup/deduplicator';
import {
  PlaylistCreator
} from "../dedup/playlistCreator";
import { SpotifyTrackType, SpotifyUserType } from '../dedup/spotifyApi';
import { Translation, useTranslation } from 'react-i18next';

import Badge from './badge';
import { DuplicateTrackList } from './duplicateTrackList';
import Panel from './panel';
import { PlaylistModel } from '../dedup/types';
import Process from '../dedup/process';
import React from 'react';



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
      track: SpotifyTrackType;
    }>;
  };
};

export const SAVED_SONGS_ID = "SAVED";

const selectedTracks = new Map<string, SpotifyTrackType[]>();

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
  };



  componentDidMount() {
    const process = new Process();
    process.on('updateState', (state: {} | ((prevState: Readonly<{}>, props: Readonly<{ api: any; user: SpotifyUserType; accessToken: string; }>) => {} | Pick<{}, never>) | Pick<{}, never>) => {
      this.setState(state);
    });
    process.process(this.props.api, this.props.user);
  }

  createNewPlaylist = (selectedTrackMap: Map<any, any>) => {
    PlaylistCreator.createPlaylistFromTracks(this.props.api, this.props.user.id, selectedTrackMap)
  }

  removeSelectedSongs(playlistId: string, selectedTracks: Map<string, SpotifyTrackType[]>) {
    (async () => {
      await SavedTracksDeduplicator.removeSelectedSongs(
        this.props.api,
        selectedTracks,
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
          {this.state.toProcess === 0 && (
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
          {this.state.toProcess === 0 && (
            <span>
              <Translation>
                {(t) => t('process.status.complete.body')}
              </Translation>
              <br />

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
                          onClick={() => this.removeSelectedSongs(SAVED_SONGS_ID, selectedTracks)}
                        >
                          <label>
                            Remove selected songs from saved tracks
                          </label>
                        </button>
                        <button
                          className="btn btn-primary btn-sm playlist-list-item__btn"
                          onClick={() => this.createNewPlaylist(selectedTracks)}
                        >
                          <label>
                            Create playlist from selected songs
                          </label>
                        </button>
                        <br />
                        <label>Select All </label>
                        <input value={SAVED_SONGS_ID} onChange={(e) => {
                          const selected = e.target.checked;
                          const savedTracks = this.state.savedTracks.unpopularSongs.map(item => item.track);
                          if (selected) {
                            selectedTracks[SAVED_SONGS_ID] = savedTracks;
                          }
                          else {
                            selectedTracks[SAVED_SONGS_ID] = [];
                          }
                        }} type="checkbox" >
                        </input>

                        <DuplicateTrackList
                          playlistId={SAVED_SONGS_ID}
                          selectionCallback={(playlistId, theseSelectedTracks) => {
                            selectedTracks[playlistId] = theseSelectedTracks;
                          }}
                          childTracks={this.state.savedTracks.unpopularSongs} />
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
                          onClick={() => this.removeSelectedSongs(playlist.playlist.id, selectedTracks)}
                        >
                          <label>
                            Remove selected songs from playlist
                          </label>
                        </button>
                        <DuplicateTrackList childTracks={playlist.unpopularSongs} playlistId={playlist.playlist.id}
                          selectionCallback={(playlistId, theseSelectedTracks) => {
                            selectedTracks[playlistId] = theseSelectedTracks;
                          }} />
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )
        }
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
      </div >
    );
  }
}
