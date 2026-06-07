export const appStringsEnglish = {
    welcomeBack: 'Welcome back',
    loginWithSocialAccount: 'Login with social account',
    loginWith: 'Login with',
    createOrganization: 'Create organization',
    joinExistingOrganization: 'Join existing organization',
    noPendingInvitations: 'You have no pending invitations',
    myAccount: 'My account',
    logout: 'Logout',
    slugErrorMessage: 'Must be between 4 and 56 characters, and only contain letters, numbers, and dashes',
    nameErrorMessage: 'Must be between 1 and 255 characters',
    newTicket: 'New ticket',
    noTickets: 'No tickets',
    noActiveTickets: 'No active tickets',
    theme: 'Theme',
    home: 'Home',
    newChannel: 'New channel',
    nothingHere: 'Nothing here',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    leaveComment: 'Leave a comment',
    addDescription: 'Add description',
    ticketTitle: 'Ticket title',
    saveComment: 'Comment',
    comment: 'Comment',
    pageNotFound: 'Page not found',
    pageNotFoundDescription: "The page you're looking for doesn't exist or may have been moved.",
    goHome: 'Go home',

    // Generic actions & status
    delete: 'Delete',
    remove: 'Remove',
    saveChanges: 'Save changes',
    discard: 'Discard',
    saving: 'Saving…',
    deleting: 'Deleting…',
    removing: 'Removing…',
    unsavedChanges: 'You have unsaved changes',
    allChangesSaved: 'All changes saved',
    somethingWentWrong: 'Something went wrong. Please try again.',
    organizationNotFound: 'Organization not found',
    channelNotFound: 'Channel not found',
    identifierLengthError: 'Identifier must be 4–56 characters, using only lowercase letters, numbers, and dashes.',
    nameLengthError: 'Name must be between 1 and 255 characters.',

    // Common field labels
    nameLabel: 'Name',
    identifierLabel: 'Identifier',
    detailsTitle: 'Details',
    nameFieldDescription: 'The display name shown across the app.',

    // Danger zone (shared)
    dangerZone: 'Danger zone',
    dangerZoneDescription: 'Irreversible actions. Proceed with caution.',
    confirmDeletePrefix: 'This action is irreversible. Type the identifier',
    confirmDeleteSuffix: 'to confirm.',

    // Channel permission option titles (shared between org settings and channel manage)
    permCreateNew: 'Create new channels',
    permViewAll: 'View all tickets',
    permCommentAll: 'Comment on all tickets',
    permCommentOwn: 'Comment on own tickets',
    permCommentAssigned: 'Comment on assigned tickets',
    permManageAll: 'Manage all tickets',
    permManageOwn: 'Manage own tickets',
    permManageAssigned: 'Manage assigned tickets',
    permFullAdmin: 'Full admin',

    // Permission descriptions (shared)
    permCreateNewDescription: 'Members can create new channels in this organization.',
    permCommentOwnDescription: 'Members can comment on tickets they created.',
    permCommentAssignedDescription: 'Members can comment on tickets assigned to them.',
    permManageAllDescription: 'Members can edit, assign and change the status of any ticket.',
    permManageOwnDescription: 'Members can manage tickets they created.',
    permManageAssignedDescription: 'Members can manage tickets assigned to them.',

    // Permission descriptions (organization defaults variant)
    orgViewAllDescription: 'Members can see every ticket in a channel, not just their own.',
    orgCommentAllDescription: 'Members can comment on any ticket in a channel.',
    orgFullAdminDescription: 'Grant members full administrative access within channels.',

    // Permission descriptions (single channel variant)
    channelViewAllDescription: 'Members can see every ticket in this channel, not just their own.',
    channelCommentAllDescription: 'Members can comment on any ticket in this channel.',
    channelFullAdminDescription: 'Grant members full administrative access within this channel.',

    // Organization settings screen
    settingsTitle: 'Settings',
    settingsSubtitle: "Manage {name}'s details and the defaults applied to its channels.",
    orgAdminAccessRequired: 'You need admin access to change these settings.',
    orgDetailsDescription: 'Basic information about your organization.',
    orgIdentifierDescription: 'Used in this organization’s URLs and must be unique. Changing it updates existing links.',
    orgNamePlaceholder: 'My Company',
    defaultChannelOptionsTitle: 'Default channel options',
    defaultChannelOptionsDescription: 'Defaults applied to new channels. Each channel can override these individually.',
    deleteOrgTitle: 'Delete this organization',
    deleteOrgDescription:
        'Permanently deletes the organization and all of its channels, tickets, comments, and members. This cannot be undone.',
    deleteOrgDialogTitle: 'Delete organization',

    // Members screen
    membersTitle: 'Members',
    membersSubtitle: 'People who have access to {name}.',
    onePersonHasAccess: '1 person has access.',
    nPeopleHaveAccess: '{count} people have access.',
    you: 'You',
    role: 'Role',
    roleOwner: 'Owner',
    roleAdmin: 'Admin',
    roleMember: 'Member',
    removeFromOrganization: 'Remove from organization',
    removeMemberTitle: 'Remove member',
    removeMemberConfirmPrefix: 'Remove',
    removeMemberConfirmSuffix:
        'from {orgName}? They will lose access to every channel in this organization. This does not delete the tickets or comments they created.',

    // Channel manage screen
    channelAdminAccessRequired: 'You need admin access to manage this channel',
    manageChannelTitle: 'Manage channel',
    manageChannelSubtitle: "Configure {name}'s details and who can do what within it.",
    channelDetailsDescription: 'Basic information about this channel.',
    channelIdentifierDescription: 'Used in this channel’s URLs and must be unique. Changing it updates existing links.',
    channelNamePlaceholder: 'My Channel',
    visibilityTitle: 'Visibility',
    visibilityDescription: 'Control who can discover this channel.',
    publicChannelTitle: 'Public channel',
    publicChannelDescription: 'Anyone in the organization can find and open this channel.',
    memberPermissionsTitle: 'Member permissions',
    memberPermissionsDescription: 'Override the organization defaults for this channel. “Inherit” keeps the organization-wide setting.',
    inherit: 'Inherit',
    allow: 'Allow',
    deny: 'Deny',
    inheritedValue: 'Inherited: {value}',
    deleteChannelTitle: 'Delete this channel',
    deleteChannelDescription: 'Permanently deletes the channel and all of its tickets and comments. This cannot be undone.',
    deleteChannelDialogTitle: 'Delete channel',

    // Menu sections
    channelSection: 'Channel',
    organizationSection: 'Organization',
    manage: 'Manage',

    // Error screen
    appCrashed: 'The app crashed. Try reloading.',

    // Organization home
    noChannels: 'No channels',
    useSidebarToCreateChannel: 'Use the side bar to create a new channel',

    // Ticket screen
    ticketNotFound: 'Ticket not found',
    activity: 'Activity',

    // User dropdown
    language: 'Language',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',

    // Dialog / sheet
    close: 'Close',

    // Invitations (admin side, on the members screen)
    inviteAction: 'Invite',
    invitePeopleTitle: 'Invite people',
    invitePeopleDescription: 'Invite someone to {name} by email. They’ll see the invitation the next time they sign in.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@example.com',
    sendInvite: 'Send invite',
    sending: 'Sending…',
    pendingInvitationsTitle: 'Pending invitations',
    onePendingInvitation: '1 invitation awaiting a response.',
    nPendingInvitations: '{count} invitations awaiting a response.',
    noPendingOrgInvitations: 'No pending invitations.',
    invitedAs: 'Invited as {role}',
    revoke: 'Revoke',

    // Invitations (invitee side)
    invitationsTitle: 'Invitations',
    invitationsSubtitle: 'Organizations that have invited you to join.',
    invitedToJoinAs: 'You’ve been invited to join as {role}.',
    invitedByLine: 'Invited by {name}',
    accept: 'Accept',
    decline: 'Decline',
    accepting: 'Joining…',
    declining: 'Declining…',

    // Leave organization (settings danger zone)
    leaveOrgTitle: 'Leave this organization',
    leaveOrgDescription: 'You’ll lose access to all of its channels. You can be invited back later.',
    leaveOrgAction: 'Leave organization',
    leaveOrgSoleOwnerHint: 'You’re the only owner. Make someone else an owner, or delete the organization, before you can leave.',
    leaveOrgConfirm: 'Are you sure you want to leave {name}? You’ll lose access to all of its channels.',
    leaving: 'Leaving…',
    leave: 'Leave',

    // Channel members screen
    channelMembersTitle: 'Channel members',
    channelMembersSubtitle: 'Who can access {name}, and what they can do within it.',
    channelMembersEmpty: 'No one has been added to this channel yet.',
    channelPublicMembersHint: 'This channel is public, so everyone in the organization can open it too.',
    addMember: 'Add member',
    addMemberDescription: 'Add an organization member to {name}.',
    noOrgMembersToAdd: 'Everyone in the organization is already in this channel.',
    add: 'Add',
    adding: 'Adding…',
    removeFromChannel: 'Remove from channel',
    removeFromChannelConfirm: 'Remove {name} from this channel? If the channel is public they will still be able to open it.',
    editPermissions: 'Edit permissions',
    editPermissionsFor: 'Permissions for {name}',
    editPermissionsDescription: 'Override this channel’s defaults for this member. “Inherit” keeps the channel or organization setting.',
} as const
