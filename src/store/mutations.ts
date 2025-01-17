/*
 * Copyright 2021 James Lyne
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MutationTree} from "vuex";
import {MutationTypes} from "@/store/mutation-types";
import {State} from "@/store/state";
import {
	DynmapMarkerSetUpdates,
	DynmapTileUpdate
} from "@/dynmap";
import {
	Coordinate,
	LiveAtlasWorldState,
	LiveAtlasSidebarSection,
	LiveAtlasSortedPlayers,
	LiveAtlasUIElement,
	LiveAtlasWorldDefinition,
	LiveAtlasParsedUrl,
	LiveAtlasGlobalConfig,
	LiveAtlasGlobalMessageConfig,
	LiveAtlasServerMessageConfig,
	LiveAtlasPlayer,
	LiveAtlasCircle,
	LiveAtlasLine,
	LiveAtlasArea,
	LiveAtlasMarker,
	LiveAtlasMarkerSet,
	LiveAtlasServerDefinition,
	LiveAtlasServerConfig, LiveAtlasChat, LiveAtlasPartialComponentConfig, LiveAtlasComponentConfig, LiveAtlasUIModal
} from "@/index";
import DynmapMapProvider from "@/providers/DynmapMapProvider";
import Pl3xmapMapProvider from "@/providers/Pl3xmapMapProvider";

export type CurrentMapPayload = {
	worldName: string;
	mapName: string;
}

export type Mutations<S = State> = {
	[MutationTypes.INIT](state: S, config: LiveAtlasGlobalConfig): void
	[MutationTypes.SET_SERVER_CONFIGURATION](state: S, config: LiveAtlasServerConfig): void
	[MutationTypes.SET_SERVER_CONFIGURATION_HASH](state: S, hash: number): void
	[MutationTypes.SET_SERVER_MESSAGES](state: S, messages: LiveAtlasServerMessageConfig): void
	[MutationTypes.SET_WORLDS](state: S, worlds: Array<LiveAtlasWorldDefinition>): void
	[MutationTypes.SET_COMPONENTS](state: S, components: LiveAtlasPartialComponentConfig | LiveAtlasComponentConfig): void
	[MutationTypes.SET_MARKER_SETS](state: S, worlds: Map<string, LiveAtlasMarkerSet>): void
	[MutationTypes.SET_WORLD_STATE](state: S, worldState: LiveAtlasWorldState): void
	[MutationTypes.ADD_MARKER_SET_UPDATES](state: S, updates: Map<string, DynmapMarkerSetUpdates>): void
	[MutationTypes.ADD_TILE_UPDATES](state: S, updates: Array<DynmapTileUpdate>): void
	[MutationTypes.ADD_CHAT](state: State, chat: Array<LiveAtlasChat>): void

	[MutationTypes.POP_MARKER_UPDATES](state: S, payload: {markerSet: string, amount: number}): void
	[MutationTypes.POP_AREA_UPDATES](state: S, payload: {markerSet: string, amount: number}): void
	[MutationTypes.POP_CIRCLE_UPDATES](state: S, payload: {markerSet: string, amount: number}): void
	[MutationTypes.POP_LINE_UPDATES](state: S, payload: {markerSet: string, amount: number}): void
	[MutationTypes.POP_TILE_UPDATES](state: S, amount: number): void

	[MutationTypes.SET_MAX_PLAYERS](state: S, maxPlayers: number): void
	[MutationTypes.SET_PLAYERS_ASYNC](state: S, players: Set<LiveAtlasPlayer>): Set<LiveAtlasPlayer>
	[MutationTypes.SYNC_PLAYERS](state: S, keep: Set<string>): void
	[MutationTypes.SET_CURRENT_SERVER](state: S, server: string): void
	[MutationTypes.SET_CURRENT_MAP](state: S, payload: CurrentMapPayload): void
	[MutationTypes.SET_CURRENT_LOCATION](state: S, payload: Coordinate): void
	[MutationTypes.SET_CURRENT_ZOOM](state: S, payload: number): void
	[MutationTypes.SET_PARSED_URL](state: S, payload: LiveAtlasParsedUrl): void
	[MutationTypes.CLEAR_PARSED_URL](state: S): void
	[MutationTypes.SET_FOLLOW_TARGET](state: S, payload: LiveAtlasPlayer): void
	[MutationTypes.SET_PAN_TARGET](state: S, payload: LiveAtlasPlayer): void
	[MutationTypes.CLEAR_FOLLOW_TARGET](state: S, a?: void): void
	[MutationTypes.CLEAR_PAN_TARGET](state: S, a?: void): void

	[MutationTypes.SET_SMALL_SCREEN](state: S, payload: boolean): void
	[MutationTypes.TOGGLE_UI_ELEMENT_VISIBILITY](state: S, payload: LiveAtlasUIElement): void
	[MutationTypes.SET_UI_ELEMENT_VISIBILITY](state: S, payload: {element: LiveAtlasUIElement, state: boolean}): void
	[MutationTypes.SHOW_UI_MODAL](state: S, payload: LiveAtlasUIModal): void
	[MutationTypes.HIDE_UI_MODAL](state: S, payload: LiveAtlasUIModal): void

	[MutationTypes.TOGGLE_SIDEBAR_SECTION_COLLAPSED_STATE](state: S, section: LiveAtlasSidebarSection): void

	[MutationTypes.SET_LOGGED_IN](state: S, payload: boolean): void
	[MutationTypes.SET_LOGIN_REQUIRED](state: S, payload: boolean): void
	[MutationTypes.RESET](state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
	[MutationTypes.INIT](state: State, config: LiveAtlasGlobalConfig) {
		const collapsedSections = localStorage.getItem('collapsedSections'),
			messageConfig = config?.messages || {},
			uiConfig = config?.ui || {};

		if(collapsedSections) {
			state.ui.sidebar.collapsedSections = new Set(JSON.parse(collapsedSections));
		}

		const messages: LiveAtlasGlobalMessageConfig = {
			chatTitle: messageConfig.chatTitle || '',
			chatLogin: messageConfig.chatLogin || '',
			chatNoMessages: messageConfig.chatNoMessages || '',
			chatSend: messageConfig.chatSend || '',
			chatPlaceholder: messageConfig.chatPlaceholder || '',
			chatErrorDisabled: messageConfig.chatErrorDisabled || '',
			chatErrorUnknown: messageConfig.chatErrorUnknown || '',
			serversHeading: messageConfig.serversHeading || '',
			worldsSkeleton: messageConfig.worldsSkeleton || '',
			playersSkeleton: messageConfig.playersSkeleton || '',
			playersTitle: messageConfig.playersTitle || '',
			playersTitleHidden: messageConfig.playersTitleHidden || '',
			playersTitleOtherWorld: messageConfig.playersTitleOtherWorld || '',
			playersSearchPlaceholder: messageConfig.playersSearchPlaceholder || '',
			playersSearchSkeleton: messageConfig.playersSearchSkeleton || '',
			followingHeading: messageConfig.followingHeading || '',
			followingHidden: messageConfig.followingHidden || '',
			followingUnfollow: messageConfig.followingUnfollow || '',
			followingTitleUnfollow: messageConfig.followingTitleUnfollow || '',
			linkTitle: messageConfig.linkTitle || '',
			loadingTitle: messageConfig.loadingTitle || '',
			locationRegion: messageConfig.locationRegion || '',
			locationChunk: messageConfig.locationChunk || '',
			contextMenuCopyLink: messageConfig.contextMenuCopyLink || '',
			contextMenuCenterHere: messageConfig.contextMenuCenterHere || '',
			toggleTitle: messageConfig.toggleTitle || '',
			mapTitle: messageConfig.mapTitle || '',
			layersTitle: messageConfig.layersTitle || '',
			copyToClipboardSuccess: messageConfig.copyToClipboardSuccess || '',
			copyToClipboardError: messageConfig.copyToClipboardError || '',
			loginTitle: messageConfig.loginTitle || '',
			loginHeading: messageConfig.loginHeading || '',
			loginUsernameLabel: messageConfig.loginUsernameLabel || '',
			loginPasswordLabel: messageConfig.loginPasswordLabel || '',
			loginSubmit: messageConfig.loginSubmit || '',
			loginErrorUnknown: messageConfig.loginErrorUnknown || '',
			loginErrorDisabled: messageConfig.loginErrorDisabled || '',
			loginErrorIncorrect: messageConfig.loginErrorIncorrect || '',
			loginSuccess: messageConfig.loginSuccess || '',
			registerHeading: messageConfig.registerHeading || '',
			registerDescription: messageConfig.registerDescription || '',
			registerConfirmPasswordLabel: messageConfig.registerConfirmPasswordLabel || '',
			registerCodeLabel: messageConfig.registerCodeLabel || '',
			registerSubmit: messageConfig.registerSubmit || '',
			registerErrorUnknown: messageConfig.registerErrorUnknown || '',
			registerErrorDisabled: messageConfig.registerErrorDisabled || '',
			registerErrorVerifyFailed: messageConfig.registerErrorVerifyFailed || '',
			registerErrorIncorrect: messageConfig.registerErrorIncorrect || '',
			logoutTitle: messageConfig.logoutTitle || '',
			logoutErrorUnknown: messageConfig.logoutErrorUnknown || '',
			logoutSuccess: messageConfig.logoutSuccess || '',
			closeTitle: messageConfig.closeTitle || '',
		}

		state.messages = Object.assign(state.messages, messages);

		if(typeof uiConfig.playersAboveMarkers === 'boolean') {
			state.ui.playersAboveMarkers = uiConfig.playersAboveMarkers;
		}

		if(typeof uiConfig.playersSearch === 'boolean') {
			state.ui.playersSearch = uiConfig.playersSearch;
		}

		state.servers = config.servers;

		if(state.currentServer && !state.servers.has(state.currentServer.id)) {
			state.currentServer = undefined;
		}
	},

	// Sets configuration options from the initial config fetch
	[MutationTypes.SET_SERVER_CONFIGURATION](state: State, config: LiveAtlasServerConfig) {
		state.configuration = Object.assign(state.configuration, config);
	},

	// Sets configuration hash
	[MutationTypes.SET_SERVER_CONFIGURATION_HASH](state: State, hash: number) {
		state.configurationHash = hash;
	},

	// Sets messages from the initial config fetch
	[MutationTypes.SET_SERVER_MESSAGES](state: State, messages: LiveAtlasServerMessageConfig) {
		state.messages = Object.assign(state.messages, messages);
	},

	//Sets the list of worlds, and their settings, from the initial config fetch
	[MutationTypes.SET_WORLDS](state: State, worlds: Array<LiveAtlasWorldDefinition>) {
		state.worlds.clear();
		state.maps.clear();

		state.followTarget = undefined;
		state.panTarget = undefined;

		state.currentWorldState.timeOfDay = 0;
		state.currentWorldState.raining = false;
		state.currentWorldState.thundering = false;

		worlds.forEach(world => {
			state.worlds.set(world.name, world);
			world.maps.forEach(map => state.maps.set([world.name, map.name].join('_'), map));
		});

		//Update current world if a world with the same name still exists, otherwise clear
		if(state.currentWorld && state.worlds.has(state.currentWorld.name)) {
			state.currentWorld = state.worlds.get(state.currentWorld.name);
		} else {
			state.currentWorld = undefined;
		}

		//Update current map if a map with the same name still exists, otherwise clear
		if(state.currentWorld && state.currentMap && state.maps.has([state.currentWorld.name, state.currentMap.name].join('_'))) {
			state.currentMap = state.maps.get([state.currentWorld.name, state.currentMap.name].join('_'));
		} else {
			state.currentMap = undefined;
		}
	},

	//Updates the state of optional components (chat, link button, etc)
	//Can be called with a LiveAtlasComponentConfig object to replace the whole state
	//or a LiveAtlasPartialComponentConfig object for partial updates to the existing state
	[MutationTypes.SET_COMPONENTS](state: State, components: LiveAtlasPartialComponentConfig | LiveAtlasComponentConfig) {
		state.components = Object.assign(state.components, components);
	},

	//Sets the existing marker sets from the last marker fetch
	[MutationTypes.SET_MARKER_SETS](state: State, markerSets: Map<string, LiveAtlasMarkerSet>) {
		state.markerSets.clear();
		state.pendingSetUpdates.clear();

		for(const entry of markerSets) {
			state.markerSets.set(entry[0], entry[1]);
			state.pendingSetUpdates.set(entry[0], {
				markerUpdates: [],
				areaUpdates: [],
				circleUpdates: [],
				lineUpdates: [],
			});
		}
	},

	//Sets the current world state an update fetch
	[MutationTypes.SET_WORLD_STATE](state: State, worldState: LiveAtlasWorldState) {
		state.currentWorldState = Object.assign(state.currentWorldState, worldState);
	},

	//Adds markerset related updates from an update fetch to the pending updates list
	[MutationTypes.ADD_MARKER_SET_UPDATES](state: State, updates: Map<string, DynmapMarkerSetUpdates>) {
		for(const entry of updates) {
			if(!state.markerSets.has(entry[0])) {

				//Create marker set if it doesn't exist
				if(entry[1].payload) {
					state.markerSets.set(entry[0], {
						id: entry[0],
						showLabels: entry[1].payload.showLabels,
						minZoom: entry[1].payload.minZoom,
						maxZoom: entry[1].payload.maxZoom,
						priority: entry[1].payload.priority,
						label: entry[1].payload.label,
						hidden: entry[1].payload.hidden,
						markers: Object.freeze(new Map()) as Map<string, LiveAtlasMarker>,
						areas: Object.freeze(new Map()) as Map<string, LiveAtlasArea>,
						circles: Object.freeze(new Map()) as Map<string, LiveAtlasCircle>,
						lines: Object.freeze(new Map()) as Map<string, LiveAtlasLine>,
					});

					state.pendingSetUpdates.set(entry[0], {
						markerUpdates: [],
						areaUpdates: [],
						circleUpdates: [],
						lineUpdates: [],
					});
				} else {
					console.warn(`ADD_MARKER_SET_UPDATES: Marker set ${entry[0]} doesn't exist`);
					continue;
				}
			}

			const set = state.markerSets.get(entry[0]) as LiveAtlasMarkerSet,
				setUpdates = state.pendingSetUpdates.get(entry[0]) as DynmapMarkerSetUpdates;

			//Delete the set if it has been deleted
			if(entry[1].removed) {
				state.markerSets.delete(entry[0]);
				state.pendingSetUpdates.delete(entry[0]);
				continue;
			}

			//Update the set itself if a payload exists
			if(entry[1].payload) {
				set.showLabels = entry[1].payload.showLabels;
				set.minZoom = entry[1].payload.minZoom;
				set.maxZoom = entry[1].payload.maxZoom;
				set.priority = entry[1].payload.priority;
				set.label = entry[1].payload.label;
				set.hidden = entry[1].payload.hidden;
			}

			//Update non-reactive lists
			for(const update of entry[1].markerUpdates) {
				if(update.removed) {
					set.markers.delete(update.id);
				} else {
					set.markers.set(update.id, update.payload as LiveAtlasMarker);
				}
			}

			for(const update of entry[1].areaUpdates) {
				if(update.removed) {
					set.areas.delete(update.id);
				} else {
					set.areas.set(update.id, update.payload as LiveAtlasArea);
				}
			}

			for(const update of entry[1].circleUpdates) {
				if(update.removed) {
					set.circles.delete(update.id);
				} else {
					set.circles.set(update.id, update.payload as LiveAtlasCircle);
				}
			}

			for(const update of entry[1].lineUpdates) {
				if(update.removed) {
					set.lines.delete(update.id);
				} else {
					set.lines.set(update.id, update.payload as LiveAtlasLine);
				}
			}

			//Add to reactive pending updates lists
			setUpdates.markerUpdates = setUpdates.markerUpdates.concat(entry[1].markerUpdates);
			setUpdates.areaUpdates = setUpdates.areaUpdates.concat(entry[1].areaUpdates);
			setUpdates.circleUpdates = setUpdates.circleUpdates.concat(entry[1].circleUpdates);
			setUpdates.lineUpdates = setUpdates.lineUpdates.concat(entry[1].lineUpdates);
		}
	},

	//Adds tile updates from an update fetch to the pending updates list
	[MutationTypes.ADD_TILE_UPDATES](state: State, updates: Array<DynmapTileUpdate>) {
		state.pendingTileUpdates = state.pendingTileUpdates.concat(updates);
	},

	//Adds chat messages from an update fetch to the chat history
	[MutationTypes.ADD_CHAT](state: State, chat: Array<LiveAtlasChat>) {
		state.chat.messages.unshift(...chat);
	},

	//Pops the specified number of marker updates from the pending updates list
	[MutationTypes.POP_MARKER_UPDATES](state: State, {markerSet, amount}) {
		if(!state.markerSets.has(markerSet)) {
			console.warn(`POP_MARKER_UPDATES: Marker set ${markerSet} doesn't exist`);
			return;
		}

		state.pendingSetUpdates.get(markerSet)!.markerUpdates.splice(0, amount);
	},

	//Pops the specified number of area updates from the pending updates list
	[MutationTypes.POP_AREA_UPDATES](state: State, {markerSet, amount}) {
		if(!state.markerSets.has(markerSet)) {
			console.warn(`POP_AREA_UPDATES: Marker set ${markerSet} doesn't exist`);
			return;
		}

		state.pendingSetUpdates.get(markerSet)!.areaUpdates.splice(0, amount);
	},

	//Pops the specified number of circle updates from the pending updates list
	[MutationTypes.POP_CIRCLE_UPDATES](state: State, {markerSet, amount}) {
		if(!state.markerSets.has(markerSet)) {
			console.warn(`POP_CIRCLE_UPDATES: Marker set ${markerSet} doesn't exist`);
			return;
		}

		state.pendingSetUpdates.get(markerSet)!.circleUpdates.splice(0, amount);
	},

	//Pops the specified number of line updates from the pending updates list
	[MutationTypes.POP_LINE_UPDATES](state: State, {markerSet, amount})  {
		if(!state.markerSets.has(markerSet)) {
			console.warn(`POP_LINE_UPDATES: Marker set ${markerSet} doesn't exist`);
			return;
		}

		state.pendingSetUpdates.get(markerSet)!.lineUpdates.splice(0, amount);
	},

	//Pops the specified number of tile updates from the pending updates list
	[MutationTypes.POP_TILE_UPDATES](state: State, amount: number) {
		state.pendingTileUpdates.splice(0, amount);
	},

	[MutationTypes.SET_MAX_PLAYERS](state: State, maxPlayers: number) {
		state.maxPlayers = maxPlayers;
	},

	// Set up to 10 players at once
	[MutationTypes.SET_PLAYERS_ASYNC](state: State, players: Set<LiveAtlasPlayer>): Set<LiveAtlasPlayer> {
		let count = 0;

		for(const player of players) {
			if(state.players.has(player.name)) {
				const existing = state.players.get(player.name);

				existing!.health = player.health;
				existing!.uuid = player.uuid;
				existing!.armor = player.armor;
				existing!.location = Object.assign(existing!.location, player.location);
				existing!.hidden = player.hidden;
				existing!.displayName = player.displayName;
				existing!.sort = player.sort;

				if(existing!.displayName !== player.displayName || existing!.sort !== player.sort) {
					state.sortedPlayers.dirty = true;
				}
			} else {
				state.sortedPlayers.dirty = true;
				state.players.set(player.name, {
					name: player.name,
					uuid: player.uuid,
					health: player.health,
					armor: player.armor,
					location: player.location,
					displayName: player.displayName,
					sort: player.sort,
					hidden: player.hidden,
				});
			}

			players.delete(player);

			if(++count >= 10) {
				break;
			}
		}

		//Re-sort sortedPlayers array if needed
		if(!players.size && state.sortedPlayers.dirty) {
			state.sortedPlayers = [...state.players.values()].sort((a, b) => {
				if(a.sort !== b.sort) {
					return a.sort - b.sort;
				}

				return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
			}) as LiveAtlasSortedPlayers;
		}

		return players;
	},

	//Removes all players not found in the provided keep set
	[MutationTypes.SYNC_PLAYERS](state: State, keep: Set<string>) {
		for(const [key, player] of state.players) {
			if(!keep.has(player.name)) {
				state.sortedPlayers.splice(state.sortedPlayers.indexOf(player), 1);
				state.players.delete(key);
			}
		}
	},

	//Sets the currently active server
	[MutationTypes.SET_CURRENT_SERVER](state: State, serverName) {
		if(!state.servers.has(serverName)) {
			throw new RangeError(`Unknown server ${serverName}`);
		}

		state.currentServer = state.servers.get(serverName);

		if(state.currentMapProvider) {
			state.currentMapProvider.stopUpdates();
			state.currentMapProvider.destroy();
		}

		switch(state.currentServer!.type) {
			case 'pl3xmap':
				state.currentMapProvider = Object.seal(
					new Pl3xmapMapProvider(state.servers.get(serverName) as LiveAtlasServerDefinition));
				break;
			case 'dynmap':
				state.currentMapProvider = Object.seal(
					new DynmapMapProvider(state.servers.get(serverName) as LiveAtlasServerDefinition));
				break;
		}
	},

	//Sets the currently active map/world
	[MutationTypes.SET_CURRENT_MAP](state: State, {worldName, mapName}) {
		mapName = [worldName, mapName].join('_');

		if(!state.worlds.has(worldName)) {
			throw new RangeError(`Unknown world ${worldName}`);
		}

		if(!state.maps.has(mapName)) {
			throw new RangeError(`Unknown map ${mapName}`);
		}

		const newWorld = state.worlds.get(worldName);

		if(state.currentWorld !== newWorld) {
			state.currentWorld = state.worlds.get(worldName);
			state.markerSets.clear();
			state.pendingSetUpdates.clear();
			state.pendingTileUpdates = [];
		}

		state.currentMap = state.maps.get(mapName);
	},

	//Sets the current location the map is showing. This is called by the map itself, and calling elsewhere will not update the map.
	[MutationTypes.SET_CURRENT_LOCATION](state: State, payload: Coordinate) {
		state.currentLocation = payload;
	},

	//Sets the current zoom level of the map. This is called by the map itself, and calling elsewhere will not update the map.
	[MutationTypes.SET_CURRENT_ZOOM](state: State, payload: number) {
		state.currentZoom = payload;
	},

	//Sets the result of parsing the current map url, if present and valid
	[MutationTypes.SET_PARSED_URL](state: State, payload: LiveAtlasParsedUrl) {
		state.parsedUrl = payload;
	},

	//Clear any existing parsed url
	[MutationTypes.CLEAR_PARSED_URL](state: State) {
		state.parsedUrl = undefined;
	},

	//Set the follow target, which the map will automatically pan to keep in view
	[MutationTypes.SET_FOLLOW_TARGET](state: State, player: LiveAtlasPlayer) {
		state.followTarget = player;
	},

	//Set the pan target, which the map will immediately pan to once
	[MutationTypes.SET_PAN_TARGET](state: State, player: LiveAtlasPlayer) {
		state.panTarget = player;
	},

	//Clear the follow target
	[MutationTypes.CLEAR_FOLLOW_TARGET](state: State) {
		state.followTarget = undefined;
	},

	//Clear the pan target
	[MutationTypes.CLEAR_PAN_TARGET](state: State) {
		state.panTarget = undefined;
	},

	[MutationTypes.SET_SMALL_SCREEN](state: State, smallScreen: boolean): void {
		if(!state.ui.smallScreen && smallScreen && state.ui.visibleElements.size > 1) {
			state.ui.visibleElements.clear();
		}

		state.ui.smallScreen = smallScreen;
	},

	[MutationTypes.TOGGLE_UI_ELEMENT_VISIBILITY](state: State, element: LiveAtlasUIElement): void {
		const newState = !state.ui.visibleElements.has(element);

		if(newState && state.ui.smallScreen) {
			state.ui.visibleElements.clear();
		}

		state.ui.previouslyVisibleElements.add(element);
		newState ? state.ui.visibleElements.add(element) : state.ui.visibleElements.delete(element);
	},

	[MutationTypes.SET_UI_ELEMENT_VISIBILITY](state: State, payload: {element: LiveAtlasUIElement, state: boolean}): void {
		if(payload.state && state.ui.smallScreen) {
			state.ui.visibleElements.clear();
		}

		if(payload.state || state.ui.visibleElements.has(payload.element)) {
			state.ui.previouslyVisibleElements.add(payload.element);
		}

		payload.state ? state.ui.visibleElements.add(payload.element) : state.ui.visibleElements.delete(payload.element);
	},

	[MutationTypes.SHOW_UI_MODAL](state: State, modal: LiveAtlasUIModal): void {
		if(state.ui.smallScreen) {
			state.ui.visibleElements.clear();
		}

		state.ui.visibleModal = modal;
	},

	[MutationTypes.HIDE_UI_MODAL](state: State, modal: LiveAtlasUIModal): void {
		if(state.ui.visibleModal === modal) {
			state.ui.visibleModal = undefined;
		}
	},

	[MutationTypes.TOGGLE_SIDEBAR_SECTION_COLLAPSED_STATE](state: State, section: LiveAtlasSidebarSection): void {
		if(state.ui.sidebar.collapsedSections.has(section)) {
			state.ui.sidebar.collapsedSections.delete(section);
		} else {
			state.ui.sidebar.collapsedSections.add(section);
		}
	},

	[MutationTypes.SET_LOGGED_IN](state: State, payload: boolean): void {
		state.loggedIn = payload;
	},

	[MutationTypes.SET_LOGIN_REQUIRED](state: State, payload: boolean): void {
		if(payload) {
			state.loggedIn = false;
		}

		state.loginRequired = payload;
	},

	//Cleanup for switching servers or reloading the configuration
	[MutationTypes.RESET](state: State): void {
		state.followTarget = undefined;
		state.panTarget = undefined;

		state.players.clear();
		state.sortedPlayers.splice(0, state.sortedPlayers.length);

		state.maxPlayers = 0;
		state.currentWorld = undefined;
		state.currentMap = undefined;

		state.markerSets.clear();
		state.pendingSetUpdates.clear();
		state.pendingTileUpdates = [];

		state.worlds.clear();
		state.maps.clear();
		state.currentZoom = 0;
		state.currentLocation = {x: 0, y: 0, z: 0};

		state.currentWorldState.timeOfDay = 0;
		state.currentWorldState.raining = false;
		state.currentWorldState.thundering = false;

		state.configurationHash = undefined;
		state.configuration.title = '';

		state.components.markers.showLabels= false;
		state.components.playerMarkers = undefined;
		state.components.coordinatesControl = undefined;
		state.components.clockControl = undefined;
		state.components.linkControl = false;
		state.components.layerControl = false;
		state.components.logoControls = [];
		state.components.chatSending = undefined;
		state.components.chatBox = undefined;
		state.components.chatBalloons = false;
		state.components.login = false;

		state.ui.visibleModal = undefined;
		state.chat.messages = [];

		state.loggedIn = false;
		state.loginRequired = false;
	}
}
