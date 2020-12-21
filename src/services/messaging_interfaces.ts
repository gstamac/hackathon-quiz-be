/* eslint-disable @typescript-eslint/ban-types */
export enum GrantType {
  refresh_token = 'refresh_token',
  implicit = 'implicit',
  client_credentials = 'client_credentials',
  password = 'password',
  authorization_code = 'authorization_code',
  signup = 'signup',
}

export interface ErrorResponseBody {
  statusCode: number
  error_id: string
  error_code: string
  message: string
}

export interface PaginationQueryParams {
  per_page?: number
  page?: number
}

export interface PaginationMetaParams {
  per_page?: number
  page?: number
  total: number
}

export interface ResponseWithPaginationMeta {
  meta: PaginationMetaParams
}

export interface TokenData {
  globalid: string
  uuid: string
  client_id: string
  valid_to?: string
  scopes?: string[]
  scope?: string
  roles?: string[]
  client_name?: string
  exp?: number
  valid_to_utc?: string
  grant_type: GrantType
  rnd?: string
  iat?: number
  appversion?: string
  integration_id?: string
}

export interface MediaPlacement {
  AudioHostUrl?: string
  AudioFallbackUrl?: string
  ScreenDataUrl?: string
  ScreenSharingUrl?: string
  ScreenViewingUrl?: string
  SignalingUrl?: string
  TurnControlUrl?: string
}

export interface Attendee {
  ExternalUserId?: string
  AttendeeId?: string
  JoinToken?: string
}

export interface ResponseOfCall {
  meeting_id: string | null
  media_region: string
  media_placement: MediaPlacement | null
  attendee: Attendee
}

export interface CallRequestBody {
  channel_id: string
}

export interface CallUserBody {
  attendee: Attendee
  meeting_id: string
  media_region: string
  media_placement: MediaPlacement
}

export interface GetCallUserQuery {
  channel_id: string
  call_uuid: string
}

export interface InternalUserData {
  uuid: string
  globalid: string
}

export interface SubscriptionPaginationQueryParams extends PaginationQueryParams {
  per_page?: number
}

export interface PubnubData {
  enabled?: boolean
}

export interface MessageEncryptionHeader {
  enc: string
  iv: string
}

export interface MessageEncryptedData {
  ciphertext: string
}

export interface MessageTemplateIcon {
  type?:
    | 'HACKATON_ICON'
    | 'URL_ICON'
    | 'VERIFICATION_ICON'
    | 'VERIFICATION_REVIEW_ICON'
    | 'VERIFICATION_IN_PROGRESS_ICON'
    | 'VERIFICATION_ATTENTION_ICON'
    | 'FUNDS_ICON'
    | 'VOUCH_ICON'
    | 'GROUP_ICON'
    | 'TRUSTEE_ICON'
    | 'CALL_ICON'
  url?: string
}

export interface MessageTemplateEncryptedIcon {
  type?:
    | 'URL_ICON'
    | 'VERIFICATION_ICON'
    | 'VERIFICATION_REVIEW_ICON'
    | 'VERIFICATION_IN_PROGRESS_ICON'
    | 'VERIFICATION_ATTENTION_ICON'
    | 'FUNDS_ICON'
    | 'VOUCH_ICON'
    | 'GROUP_ICON'
    | 'TRUSTEE_ICON'
    | 'CALL_ICON'
  url?: MessageEncryptedData
}

export interface MessageTemplateButtonItem {
  type: 'OUTLINED' | 'CONTAINED' | 'TEXT'
  title: string
  cta_type: 'DEEPLINK' | 'URL'
  cta_link: string
  mode: 'PRIMARY' | 'SECONDARY' | 'ADDITIONAL'
}

export interface MessageTemplateEncryptedButtonItem {
  type: 'OUTLINED' | 'CONTAINED' | 'TEXT'
  title: MessageEncryptedData
  cta_type: 'DEEPLINK' | 'URL'
  cta_link: MessageEncryptedData
  mode: 'PRIMARY' | 'SECONDARY' | 'ADDITIONAL'
}

export interface MessageCardElement {
  icon?: MessageTemplateIcon
  title_text?: string
  primary_text?: string
  secondary_text?: string
  additional_text?: string
  buttons?: MessageTemplateButtonItem[]
}

export interface MessageEncryptedCardElement {
  icon?: MessageTemplateEncryptedIcon
  title_text?: MessageEncryptedData
  primary_text?: MessageEncryptedData
  secondary_text?: MessageEncryptedData
  additional_text?: MessageEncryptedData
  buttons?: MessageTemplateEncryptedButtonItem[]
}

export interface MediaThumbnail {
  small: string
  medium: string
  large: string
}

export interface EncryptedMediaThumbnail {
  small: MessageEncryptedData
  medium: MessageEncryptedData
  large: MessageEncryptedData
}

export interface MetadataResolution {
  width: number
  height: number
}

export interface MediaMetadata {
  size: number
  dimensions: MetadataResolution
  duration?: number
  format: string
}

export interface MediaAsset {
  uuid: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  thumbnails: MediaThumbnail
  meta: MediaMetadata
}

export interface EncryptedMediaAsset {
  uuid: string
  url: MessageEncryptedData
  type: 'IMAGE' | 'VIDEO'
  thumbnails: EncryptedMediaThumbnail
  meta: MediaMetadata
}

export interface MessageTemplateText {
  text: string
}

export interface MessageTemplateEncryptedText extends MessageEncryptedData {
  encryption_header: MessageEncryptionHeader
}

export interface MessageCardDualViewElements {
  sender: MessageCardElement
  recipient: MessageCardElement
}

export interface MessageEncryptedCardDualViewElements {
  sender: MessageEncryptedCardElement
  recipient: MessageEncryptedCardElement
}

export interface MessageTemplateCardView {
  text: string
  payload: Object
  elements: MessageCardElement
}

export interface MessageTemplateEncryptedCardView {
  text: MessageEncryptedData
  payload: Object
  elements: MessageEncryptedCardElement
  encryption_header: MessageEncryptionHeader
}

export interface MessageTemplateCardDualView {
  text: string
  payload: Object
  elements: MessageCardDualViewElements
}

export interface MessageTemplateEncryptedCardDualView {
  text: MessageEncryptedData
  payload: Object
  elements: MessageEncryptedCardDualViewElements
  encryption_header: MessageEncryptionHeader
}

export interface MessageTemplateMedia {
  text?: string
  additional_text?: string
  list_view_type: 'HORIZONTAL' | 'VERTICAL' | 'GRID'
  assets: MediaAsset[]
}

export interface MessageTemplateEncryptedMedia {
  text?: MessageEncryptedData
  additional_text?: MessageEncryptedData
  list_view_type: 'HORIZONTAL' | 'VERTICAL' | 'GRID'
  assets: EncryptedMediaAsset[]
  encryption_header: MessageEncryptionHeader
}

export interface MessageTemplateMediaWithEncryptedText {
  text?: MessageEncryptedData
  list_view_type: 'HORIZONTAL' | 'VERTICAL' | 'GRID'
  assets: MediaAsset[]
  encryption_header: MessageEncryptionHeader
}

export interface GetMessageParams {
  message_id: string
}

export interface UpdateMessageParams {
  message_id: string
}

export interface MessageContent {
  type:
    | 'TEXT'
    | 'ENCRYPTED_TEXT'
    | 'CARD_VIEW'
    | 'ENCRYPTED_CARD_VIEW'
    | 'CARD_DUAL_VIEW'
    | 'ENCRYPTED_CARD_DUAL_VIEW'
    | 'MEDIA'
    | 'ENCRYPTED_MEDIA'
    | 'MEDIA_WITH_TEXT'
    | 'MEDIA_WITH_ENCRYPTED_TEXT'
    | 'SYSTEM'
    | 'DELETED'
  content: string
  silent?: boolean
}

export interface MessagePayload extends MessageContent {
  uuid: string
  reference_message_id?: string | null
}

export interface AddMessageContent {
  type:
    | 'TEXT'
    | 'ENCRYPTED_TEXT'
    | 'CARD_VIEW'
    | 'ENCRYPTED_CARD_VIEW'
    | 'CARD_DUAL_VIEW'
    | 'ENCRYPTED_CARD_DUAL_VIEW'
    | 'MEDIA'
    | 'ENCRYPTED_MEDIA'
    | 'MEDIA_WITH_TEXT'
    | 'MEDIA_WITH_ENCRYPTED_TEXT'
    | 'DELETED'
  content: string
  silent?: boolean
}

export interface UpdateMessageContent {
  type:
    | 'TEXT'
    | 'ENCRYPTED_TEXT'
    | 'CARD_VIEW'
    | 'ENCRYPTED_CARD_VIEW'
    | 'CARD_DUAL_VIEW'
    | 'ENCRYPTED_CARD_DUAL_VIEW'
    | 'MEDIA'
    | 'ENCRYPTED_MEDIA'
    | 'MEDIA_WITH_TEXT'
    | 'MEDIA_WITH_ENCRYPTED_TEXT'
    | 'DELETED'
  content: string
  silent?: boolean
}

export interface AddMessagePayload extends AddMessageContent {
  uuid: string
  reference_message_id?: string | null
}

export interface MessagePreview extends MessagePayload {
  id: string
  sequence_id: number
  author: string
  deleted: boolean
  created_at: string
  updated_at?: string
  deleted_at?: string | null
  deleted_by?: string | null
  reference_message_id: string | null
  reference_message: Object | null
}

export interface Message extends MessagePreview {
  channel_id: string
  delivered: boolean
  reference_message: Object | null
}

export interface MessageDelivered {
  channel_id: string
  delivered_at: string
  message_id: string
  user_id: string
}

export interface MessageSeen {
  id: string
  channel_id: string
  message_id: string
  seen_at: string
  gid_uuid: string
}

export interface MessagesWithSeen {
  messages: Message[]
  message_seen: MessageSeen | null
}

export interface MessagesWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: MessagesWithSeen
}

export interface AddMessageBody {
  message: AddMessagePayload
  channels: string[]
}

export interface AddMessageInternalBody extends AddMessageBody {
  user_data: InternalUserData
}

export interface DeleteMessagesParams {
  ids: string[]
}

export interface GetChannelParams {
  channel_id: string
}

export interface GetChannelQueryParams {
  device_id?: string
}

export interface InternalGetChannelQueryParams {
  gid_uuid: string
}

export interface GetChannelsQuery extends PaginationQueryParams {
  updated_at_from?: string
  folder_ids?: string[]
  channelTypes?: ('PERSONAL' | 'MULTI' | 'GROUP')[]
  device_id?: string
  group_uuid?: string
}

export interface SearchChannelsQuery extends PaginationQueryParams {
  device_id?: string
}

export interface GetMessagesQueryParams extends PaginationQueryParams {
  from_sequence_id?: number
  to_sequence_id?: number
}

export interface ChannelSecretHeader {
  alg: string
  kid: string
}

export interface ChannelSecret {
  encrypted_secret: string
  header: ChannelSecretHeader
}

export interface ChannelDeviceSecret {
  device_id: string
  secret: ChannelSecret
}

export interface ParticipantChannelSecret {
  gid_uuid: string
  secret: ChannelSecret
}

export interface ParticipantChannelDeviceSecret extends ParticipantChannelSecret {
  device_id: string
}

export interface ChannelIdWithChannelSecret {
  channel_id: string
  secret: ChannelSecret
}

export interface ChannelIdWithSecretDevice {
  channel_id: string
  device_id: string
  secret: ChannelSecret
}

export interface ChannelPermission {
  name: 'READONLY'
  value: boolean
}

export interface Channel {
  id: string
  alias: string
  uuid: string
  type: 'SERVICE' | 'PRESENCE' | 'PERSONAL' | 'MULTI' | 'GROUP'
  exposed: boolean
  title?: string | null
  description?: string | null
  image_url?: string | null
  deleted: boolean
  created_by: string
  created_at: string
  updated_by?: string | null
  updated_at?: string | null
  message?: MessagePreview
  unread_count?: number
  secret?: ChannelSecret | null
  permissions?: ChannelPermission[]
  folder_id?: string | null
  group_uuid?: string | null
  secrets?: ChannelDeviceSecret[]
  member_visibility: 'PUBLIC' | 'HIDDEN'
  members_count: number
}

export interface ChannelWithParticipants extends Channel {
  participants: string[]
}

export interface LeaveChannelResponse extends Channel {
  participants: string[]
}

export interface ChannelWithParticipantsAndPermissions extends ChannelWithParticipants {
  permissions: ChannelPermission[]
}

export interface ChannelId {
  channelId: string
}

export interface ChannelsWithParticipants {
  channels: ChannelWithParticipants[]
}

export interface ChannelsWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: ChannelsWithParticipants
}

export interface AddChannelBody {
  participants: string[]
  uuid: string
  exposed: boolean
  type: 'PERSONAL' | 'MULTI'
  title?: string | null
  description?: string | null
  image_url?: string
  secrets?: ParticipantChannelSecret[]
  group_uuid?: string
}

export interface UpdateChannelBase {
  secrets?: ParticipantChannelSecret[]
  title?: string | null
  description?: string | null
}

export interface AddChannelWithDevicesBody extends AddChannelBody {
  secrets: ParticipantChannelDeviceSecret[]
}

export interface UpdateChannelBody extends UpdateChannelBase {
  image_url?: string
}

export interface UpdateChannelWithDevicesBody extends UpdateChannelBody {
  secrets?: ParticipantChannelDeviceSecret[]
}

export interface UpdateGroupChannelBody extends UpdateChannelBase {
  image_url?: string | null
  member_visibility?: 'PUBLIC' | 'HIDDEN'
}

export interface UpdateChannelInternalBody extends UpdateGroupChannelBody {
  user_data: InternalUserData
  secrets?: ParticipantChannelDeviceSecret[]
}

export interface UpdateChannelsSecretsBody {
  secrets: ChannelIdWithSecretDevice[]
}

export interface AddChannelInternalBody extends AddChannelBody {
  type: 'PERSONAL' | 'MULTI'
  user_data: InternalUserData
  permissions?: ChannelPermission[]
  group_uuid?: string
  member_visibility?: 'PUBLIC' | 'HIDDEN'
  secrets?: ParticipantChannelDeviceSecret[]
}

export interface SearchByChannelsBody {
  participants: string[]
  channelTypes?: ('PERSONAL' | 'MULTI' | 'GROUP')[]
  group_uuid?: string
}

export interface Replacements {
  participantsLength: number
  participants: string[]
  channelTypes: ('SERVICE' | 'PRESENCE' | 'PERSONAL' | 'MULTI' | 'GROUP')[]
  group_uuid?: string
}

export interface Typing {
  author: string
  channel_id: string
  started_at: string
}

export interface AddChannelDeviceBody {
  device_id: string
  gid_uuid: string
  channel_secrets: ChannelIdWithChannelSecret[]
}

export interface InternalChannelDevice {
  id: string
  device_id: string
  channel_user_id: string
  is_primary: boolean
  secret: ChannelSecret
}

export interface Counter {
  id: string
  unread_count: number
}

export interface Counters {
  counters: Counter[]
}

export interface CountersWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: Counters
}

export interface GroupCounter {
  group_uuid: string
  unread_channel_count: number
}

export interface GroupCounters {
  groups: GroupCounter[]
}

export interface GroupCounterParams {
  group_uuid: string
}

export interface GroupCountersPaginationMeta extends PaginationMetaParams {
  total_unread: number
}

export interface GroupCountersWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: GroupCountersPaginationMeta
  data: GroupCounters
}

export interface ChannelCounter {
  unread_channel: number
}

export interface ChannelCounterParams {
  user_id: string
}

export interface ChannelCounterQueryParams {
  folder_types?: ('GENERAL' | 'UNKNOWN' | 'SYSTEM' | 'CUSTOM')[]
}

export interface GetCountersQuery extends PaginationQueryParams {
  folder_ids?: string[]
  channelTypes?: ('SERVICE' | 'PRESENCE' | 'PERSONAL' | 'MULTI' | 'GROUP')[]
  group_uuid?: string
}

export interface Subscription {
  id: string
  alias: string
}

export interface SubscriptionsWithKey {
  channels: Subscription[]
  subscribe_key: string
}

export interface SubscriptionsWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: SubscriptionsWithKey
}

export interface BlockedUser {
  id: string
  user_id: string
  blocked_by: string
  blocked_at: string
}

export interface BlockedUsers {
  blocked_users: BlockedUser[]
}

export interface BlockedUsersWithPaginationMeta extends ResponseWithPaginationMeta {
  data: BlockedUsers
  meta: PaginationMetaParams
}

export interface BlockedUserParams {
  user_id: string
}

export interface SignerCustomPolicy {
  'CloudFront-Policy': string
  'CloudFront-Key-Pair-Id': string
  'CloudFront-Signature': string
}

export interface FileToken {
  channel_id: string
  token: SignerCustomPolicy
  expires_in: string
}

export interface FileTokens {
  file_tokens: FileToken[]
}

export interface FileTokensWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: FileTokens
}

export interface GetChannelFileTokenParam {
  channel_id: string
}

export interface Folder {
  id: string
  uuid: string
  name: string
  description?: string | null
  type: 'GENERAL' | 'UNKNOWN' | 'SYSTEM' | 'CUSTOM'
  image_url?: string | null
  muted: boolean
  gid_uuid: string
}

export interface UpdateFolderBody {
  name: string
  description?: string | null
  muted: boolean
  image_url?: string | null
}

export interface AddFolderBody extends UpdateFolderBody {
  uuid: string
}

export interface GetFolderParams {
  folder_id: string
}

export interface Folders {
  folders: Folder[]
}

export interface FoldersWithPaginationMeta extends ResponseWithPaginationMeta {
  meta: PaginationMetaParams
  data: Folders
}

export interface GetFoldersQuery extends PaginationQueryParams {
  type?: 'GENERAL' | 'UNKNOWN' | 'SYSTEM' | 'CUSTOM'
}
