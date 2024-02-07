export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Upload: any;
};

export type Ai = {
  __typename?: "AI";
  _id?: Maybe<Scalars["ID"]>;
  creator?: Maybe<Scalars["ID"]>;
  edenAI?: Maybe<EdenAi>;
  mentioned?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  message?: Maybe<Scalars["String"]>;
  serverID?: Maybe<Scalars["String"]>;
};

export type AddCvToUserOutput = {
  __typename?: "AddCVToUserOutput";
  cvSummary?: Maybe<Scalars["String"]>;
  userID?: Maybe<Scalars["String"]>;
};

export type CvToPositionType = {
  __typename?: "CVToPositionType";
  content?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type Cv_ConvoToPositionType = {
  __typename?: "CV_ConvoToPositionType";
  content?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type CVtoJobsInput = {
  cvString?: InputMaybe<Scalars["String"]>;
};

export type CVtoJobsOutput = {
  __typename?: "CVtoJobsOutput";
  result?: Maybe<Scalars["String"]>;
};

export type CVtoSummaryInput = {
  cvString?: InputMaybe<Scalars["String"]>;
};

export type CVtoSummaryOutput = {
  __typename?: "CVtoSummaryOutput";
  result?: Maybe<Scalars["String"]>;
};

export type CandidateType = {
  __typename?: "CandidateType";
  acceptedOrRejected?: Maybe<Scalars["Boolean"]>;
  analysisCandidateEdenAI?: Maybe<AnalysisCandidateEdenAiType>;
  averageScoreNotesInterview?: Maybe<Scalars["Float"]>;
  candidateScoreCardCalculated?: Maybe<Scalars["Boolean"]>;
  compareCandidatePosition?: Maybe<CompareCandidatePositionType>;
  conversation?: Maybe<Array<Maybe<ConversationType>>>;
  conversationID?: Maybe<Scalars["ID"]>;
  cvID?: Maybe<Scalars["String"]>;
  dateApply?: Maybe<Scalars["String"]>;
  futurePotential?: Maybe<Array<Maybe<AttributeCandidateType>>>;
  interviewQuestionsForCandidate?: Maybe<
    Array<Maybe<InterviewQuestionsForCandidateType>>
  >;
  keyAttributes?: Maybe<Array<Maybe<AttributeCandidateType>>>;
  notesInterview?: Maybe<Array<Maybe<NotesInterviewType>>>;
  overallScore?: Maybe<Scalars["Float"]>;
  positionID?: Maybe<Scalars["ID"]>;
  readyToDisplay?: Maybe<Scalars["Boolean"]>;
  scoreCardCategoryMemories?: Maybe<Array<Maybe<ScoreCardCategoryMemoryType>>>;
  scoreCardTotal?: Maybe<ScoreCardTotalType>;
  skillScore?: Maybe<Scalars["Float"]>;
  submitted?: Maybe<Scalars["Boolean"]>;
  summaryQuestions?: Maybe<Array<Maybe<SummaryQuestionType>>>;
  user?: Maybe<Members>;
};

export type CandidateTypeInput = {
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CardMemoriesUsedType = {
  __typename?: "CardMemoriesUsedType";
  cardMemory?: Maybe<CardMemory>;
  score?: Maybe<Scalars["Float"]>;
};

export type CardMemory = {
  __typename?: "CardMemory";
  _id?: Maybe<Scalars["ID"]>;
  authorCard?: Maybe<AuthorCardMemory>;
  connectedCards?: Maybe<Array<Maybe<ConnectedCards>>>;
  content?: Maybe<Scalars["String"]>;
  futurePotential?: Maybe<Scalars["Boolean"]>;
  keyPriority?: Maybe<Scalars["Boolean"]>;
  pineconeDB?: Maybe<PineconeDbType>;
  primitives?: Maybe<Array<Maybe<PrimitivesType>>>;
  priority?: Maybe<Scalars["Int"]>;
  score?: Maybe<ScoreCardMemory>;
  scoreCriteria?: Maybe<Scalars["String"]>;
  tradeOffBoost?: Maybe<Scalars["Int"]>;
  type?: Maybe<TypeCardMemoryEnum>;
};

export type CardMemoryMemberType = {
  __typename?: "CardMemoryMemberType";
  cardMemory?: Maybe<CardMemory>;
  primitives?: Maybe<Array<Maybe<PrimitiveCardMemType>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type CardMemoryOutputType = {
  __typename?: "CardMemoryOutputType";
  cardMemory?: Maybe<CardMemory>;
  nodeOutput?: Maybe<Array<Maybe<NodeOutputType>>>;
  scoreCardTotal?: Maybe<Scalars["Float"]>;
};

export enum CategoryEnum {
  Project = "project",
  Role = "role",
  Skill = "skill",
}

export type ChatExternalApp = {
  __typename?: "ChatExternalApp";
  _id?: Maybe<Scalars["ID"]>;
  chatID_TG?: Maybe<Scalars["String"]>;
  communicationAuthorType?: Maybe<CommunicationAuthorTypeEnum>;
  message?: Maybe<Scalars["String"]>;
  projectID?: Maybe<Scalars["ID"]>;
  senderRole?: Maybe<SenderRoleEnum>;
  timeStamp?: Maybe<Scalars["Date"]>;
  userID?: Maybe<Scalars["String"]>;
};

export type Chats = {
  __typename?: "Chats";
  _id?: Maybe<Scalars["ID"]>;
  message?: Maybe<Scalars["String"]>;
  projectID?: Maybe<Scalars["ID"]>;
  projectRoleID?: Maybe<Scalars["ID"]>;
  receiverID?: Maybe<Scalars["ID"]>;
  reply?: Maybe<ReplyType>;
  result?: Maybe<ResultEnum>;
  senderID?: Maybe<Scalars["ID"]>;
  serverID?: Maybe<Scalars["ID"]>;
  threadID?: Maybe<Scalars["ID"]>;
};

export type Combo = {
  __typename?: "Combo";
  id?: Maybe<Scalars["ID"]>;
  label?: Maybe<Scalars["String"]>;
  style?: Maybe<StyleNodeOut>;
};

export type Company = {
  __typename?: "Company";
  _id?: Maybe<Scalars["ID"]>;
  approvedEmails?: Maybe<Array<Maybe<Scalars["String"]>>>;
  benefits?: Maybe<Scalars["String"]>;
  candidatesNum?: Maybe<Scalars["Int"]>;
  communitiesSubscribed?: Maybe<Array<Maybe<Company>>>;
  communitySubscribers?: Maybe<Array<Maybe<CommunitySubscribersType>>>;
  companySubscribersCommunity?: Maybe<Array<Maybe<Company>>>;
  culture?: Maybe<CompanyCultureType>;
  description?: Maybe<Scalars["String"]>;
  edenTake?: Maybe<Scalars["String"]>;
  employees?: Maybe<Array<Maybe<EmployeeType>>>;
  employeesNumber?: Maybe<Scalars["Int"]>;
  founders?: Maybe<Scalars["String"]>;
  funding?: Maybe<Array<Maybe<CompanyFoundRoundType>>>;
  glassdoor?: Maybe<Scalars["String"]>;
  imageUrl?: Maybe<Scalars["String"]>;
  insights?: Maybe<Array<Maybe<CompanyInsightType>>>;
  mission?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  positionSubscribersCommunity?: Maybe<Array<Maybe<Position>>>;
  positions?: Maybe<Array<Maybe<Position>>>;
  skillsNum?: Maybe<Scalars["Int"]>;
  slug?: Maybe<Scalars["String"]>;
  stripe?: Maybe<StripeType>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  type?: Maybe<TypeCompany>;
  url?: Maybe<Scalars["String"]>;
  values?: Maybe<Scalars["String"]>;
  whatsToLove?: Maybe<Scalars["String"]>;
};

export type CompanyCultureType = {
  __typename?: "CompanyCultureType";
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type CompanyCultureTypeInput = {
  description?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type CompanyFoundRoundType = {
  __typename?: "CompanyFoundRoundType";
  amount?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
};

export type CompanyFoundRoundTypeInput = {
  amount?: InputMaybe<Scalars["String"]>;
  date?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type CompanyInsightType = {
  __typename?: "CompanyInsightType";
  letter?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
};

export type CompanyInsightTypeInput = {
  letter?: InputMaybe<Scalars["String"]>;
  text?: InputMaybe<Scalars["String"]>;
};

export type ConnectMemoriesToKnowledgeGraph_V2Output = {
  __typename?: "ConnectMemoriesToKnowledgeGraph_V2Output";
  node?: Maybe<Node>;
  positionConnectedToKG?: Maybe<Position>;
  userConnectedToKG?: Maybe<Members>;
  usersLeft?: Maybe<Scalars["Int"]>;
};

export type ConnectedCardMemory = {
  __typename?: "ConnectedCardMemory";
  card?: Maybe<CardMemory>;
  score?: Maybe<Scalars["Float"]>;
};

export type ConnectedNodes = {
  __typename?: "ConnectedNodes";
  node?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
};

export type Conversation = {
  __typename?: "Conversation";
  _id?: Maybe<Scalars["ID"]>;
  convKey?: Maybe<Scalars["String"]>;
  conversation?: Maybe<Array<Maybe<ConversationType>>>;
  extraPositionsID?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  lastMsgSummed?: Maybe<Scalars["Int"]>;
  positionID?: Maybe<Scalars["String"]>;
  positionTrainEdenAI?: Maybe<Scalars["Boolean"]>;
  questionsAnswered?: Maybe<Array<Maybe<QuestionAnsweredType>>>;
  stateSearch?: Maybe<StateSearchType>;
  subjectConv?: Maybe<SubjectConvType>;
  summariesMessages?: Maybe<Array<Maybe<SummariesMessagesType>>>;
  summary?: Maybe<Array<Maybe<SummaryType>>>;
  summaryReady?: Maybe<Scalars["Boolean"]>;
  threadID_openAI?: Maybe<Scalars["String"]>;
  typeConversation?: Maybe<TypeConversationEnum>;
  typeConvo?: Maybe<TypeConvoEnum>;
  updatedAt?: Maybe<Scalars["Date"]>;
  userID?: Maybe<Scalars["String"]>;
};

export type DateType = {
  __typename?: "DateType";
  day?: Maybe<Scalars["Int"]>;
  month?: Maybe<Scalars["Int"]>;
  year?: Maybe<Scalars["Int"]>;
};

export type DistanceType = {
  __typename?: "DistanceType";
  hop0?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  hop1?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  hop2?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  hop3?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type EdenAi = {
  __typename?: "EdenAI";
  keywords?: Maybe<Array<Maybe<Keyword>>>;
  nodes?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type EdenAiInput = {
  keywords?: InputMaybe<Array<InputMaybe<KeywordInput>>>;
  nodes?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type Edge = {
  __typename?: "Edge";
  distanceRation?: Maybe<Scalars["Float"]>;
  source?: Maybe<Scalars["ID"]>;
  style?: Maybe<StyleEdgeOut>;
  target?: Maybe<Scalars["ID"]>;
  type?: Maybe<Scalars["String"]>;
};

export type EmployeeType = {
  __typename?: "EmployeeType";
  status?: Maybe<EmployeeStatus>;
  typeT?: Maybe<EmployeeRole>;
  user?: Maybe<Members>;
};

export type EmployeeTypeInput = {
  status?: InputMaybe<EmployeeStatus>;
  typeT?: InputMaybe<EmployeeRole>;
  userID?: InputMaybe<Scalars["String"]>;
};

export type Endorsement = {
  __typename?: "Endorsement";
  _id?: Maybe<Scalars["ID"]>;
  arweaveTransactionID?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  discussion?: Maybe<Array<Maybe<DiscussionMessage>>>;
  endorsementMessage?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<EndorseNode>>>;
  stake?: Maybe<Scalars["Float"]>;
  stars?: Maybe<Scalars["Int"]>;
  userReceive?: Maybe<Members>;
  userSend?: Maybe<Members>;
};

export type EndorsementLink = {
  __typename?: "EndorsementLink";
  _id?: Maybe<Scalars["ID"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  memberInfo?: Maybe<Members>;
  message?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<NodesType>>>;
};

export type Epic = {
  __typename?: "Epic";
  _id?: Maybe<Scalars["ID"]>;
  author?: Maybe<Members>;
  champion?: Maybe<Members>;
  channelDiscordlID?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  members?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  notifyUsers?: Maybe<Array<Maybe<Members>>>;
  phase?: Maybe<PhaseEpicType>;
  project?: Maybe<Project>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  task?: Maybe<Array<Maybe<ProjectUpdate>>>;
  teams?: Maybe<Array<Maybe<Team>>>;
};

export type ErrorLog = {
  __typename?: "ErrorLog";
  _id: Scalars["ID"];
  code?: Maybe<Scalars["String"]>;
  component?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["String"]>;
  errorType?: Maybe<Scalars["String"]>;
  memberInfo?: Maybe<Members>;
  message?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  path?: Maybe<Array<Maybe<Scalars["String"]>>>;
  stacktrace?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url?: Maybe<Scalars["String"]>;
};

export type GrantTemplate = {
  __typename?: "GrantTemplate";
  _id?: Maybe<Scalars["ID"]>;
  amount?: Maybe<Scalars["String"]>;
  applicationProcess?: Maybe<Array<Maybe<Scalars["String"]>>>;
  avatar?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  difficulty?: Maybe<Scalars["String"]>;
  distributed?: Maybe<Scalars["Int"]>;
  maxDistributed?: Maybe<Scalars["Int"]>;
  membersApplied?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<NodesType>>>;
  requirments?: Maybe<Array<Maybe<Scalars["String"]>>>;
  resources?: Maybe<Array<Maybe<ResourcesType>>>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  smallDescription?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Graph = {
  __typename?: "Graph";
  combos?: Maybe<Array<Maybe<Combo>>>;
  edges?: Maybe<Array<Maybe<Edge>>>;
  nodesVisual?: Maybe<Array<Maybe<NodeVisual>>>;
};

export type GraphNeighborType = {
  __typename?: "GraphNeighborType";
  hopN?: Maybe<Scalars["Int"]>;
  node?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
  weightSeparate?: Maybe<Array<Maybe<WeightSeparateType>>>;
  weightTotal?: Maybe<Scalars["Float"]>;
};

export type Keyword = {
  __typename?: "Keyword";
  embedding?: Maybe<Array<Maybe<Scalars["Float"]>>>;
  keywords?: Maybe<Scalars["String"]>;
};

export type KeywordInput = {
  embedding?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  keywords?: InputMaybe<Scalars["String"]>;
};

export type KeywordValue = {
  __typename?: "KeywordValue";
  confidence?: Maybe<Scalars["Int"]>;
  keyword?: Maybe<Scalars["String"]>;
  node?: Maybe<Node>;
  nodeID?: Maybe<Scalars["ID"]>;
};

export type LurkersAndContributors = {
  __typename?: "LurkersAndContributors";
  contributors?: Maybe<Scalars["Int"]>;
  lurkers?: Maybe<Scalars["Int"]>;
};

export type MatchPercentage = {
  __typename?: "MatchPercentage";
  budgetPercentage?: Maybe<Scalars["Float"]>;
  hoursPercentage?: Maybe<Scalars["Float"]>;
  percentageWithPenalty?: Maybe<Scalars["Float"]>;
  realTotalPercentage?: Maybe<Scalars["Float"]>;
  skillTotalPercentage?: Maybe<Scalars["Float"]>;
  totalPercentage?: Maybe<Scalars["Float"]>;
};

export type MatchType = {
  __typename?: "MatchType";
  distanceMembers?: Maybe<DistanceType>;
  distanceProjectRoles?: Maybe<DistanceType>;
  recalculateMembers?: Maybe<Scalars["Boolean"]>;
  recalculateProjectRoles?: Maybe<Scalars["Boolean"]>;
};

export type Members = {
  __typename?: "Members";
  _id?: Maybe<Scalars["ID"]>;
  archiveProjects?: Maybe<Array<Maybe<Scalars["String"]>>>;
  attributes?: Maybe<AttributesType>;
  bio?: Maybe<Scalars["String"]>;
  budget?: Maybe<BudgetMemberType>;
  chat?: Maybe<ChatResponse>;
  companies?: Maybe<Array<Maybe<CompanyType>>>;
  completedOpportunities?: Maybe<Scalars["Int"]>;
  conduct?: Maybe<ConductType>;
  content?: Maybe<ContentType>;
  cvInfo?: Maybe<CvInfoType>;
  discordAvatar?: Maybe<Scalars["String"]>;
  discordName?: Maybe<Scalars["String"]>;
  discriminator?: Maybe<Scalars["String"]>;
  endorseSummary?: Maybe<EndorseSummaryType>;
  endorsementsReceive?: Maybe<Array<Maybe<Endorsement>>>;
  endorsementsSend?: Maybe<Array<Maybe<Endorsement>>>;
  endorsementsSendStats?: Maybe<EndorsementsSendStatsType>;
  experienceLevel?: Maybe<ExperienceLevelType>;
  gardenUpdate?: Maybe<GardenUpdateType>;
  hoursPerWeek?: Maybe<Scalars["Float"]>;
  interest?: Maybe<Scalars["String"]>;
  invitedBy?: Maybe<MembersSmallType>;
  links?: Maybe<Array<Maybe<LinkType>>>;
  location?: Maybe<Scalars["String"]>;
  memberRole?: Maybe<RoleTemplate>;
  memory?: Maybe<MemoryMemberType>;
  network?: Maybe<Array<Maybe<Members>>>;
  nodes?: Maybe<Array<Maybe<NodesType>>>;
  onbording?: Maybe<OnboardingType>;
  oneLiner?: Maybe<Scalars["String"]>;
  positionsApplied?: Maybe<Array<Maybe<PositionsAppliedType>>>;
  preferences?: Maybe<PreferencesType>;
  previousProjects?: Maybe<Array<Maybe<PreviousProjectsType>>>;
  projects?: Maybe<Array<Maybe<ProjectMemberType>>>;
  registeredAt?: Maybe<Scalars["String"]>;
  reviewSummary?: Maybe<ReviewSummaryType>;
  reviewsReceive?: Maybe<Array<Maybe<Review>>>;
  reviewsSend?: Maybe<Array<Maybe<Review>>>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  skills?: Maybe<Array<Maybe<SkillType_Member>>>;
  stateEdenChat?: Maybe<StateEdenChatType>;
  timeZone?: Maybe<Scalars["String"]>;
  totalIncome?: Maybe<Scalars["Float"]>;
  totalNodeTrust?: Maybe<TotalNodeTrustType>;
  tweets?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type MembersSmallType = {
  __typename?: "MembersSmallType";
  _id?: Maybe<Scalars["ID"]>;
  discordAvatar?: Maybe<Scalars["String"]>;
  discordName?: Maybe<Scalars["String"]>;
  discriminator?: Maybe<Scalars["String"]>;
};

export type MemoryInput = {
  content?: InputMaybe<Scalars["String"]>;
  primitives?: InputMaybe<Array<InputMaybe<PrimitiveInput>>>;
  score?: InputMaybe<Scalars["Float"]>;
};

export type MemoryPinecone = {
  __typename?: "MemoryPinecone";
  _id?: Maybe<Scalars["ID"]>;
  convKey?: Maybe<Scalars["String"]>;
  database?: Maybe<Scalars["String"]>;
  environment?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  memory?: Maybe<Scalars["String"]>;
  pineconeID?: Maybe<Scalars["String"]>;
  position?: Maybe<Position>;
  user?: Maybe<Members>;
};

export type Mutation = {
  __typename?: "Mutation";
  CVtoJobs?: Maybe<CVtoJobsOutput>;
  CVtoSummary?: Maybe<CVtoSummaryOutput>;
  addCandidatesPosition?: Maybe<Position>;
  addCardMemory?: Maybe<CardMemory>;
  addChatExternalApp?: Maybe<ChatExternalApp>;
  addConvRecruiterToPosition?: Maybe<Position>;
  addEmployeesCompany?: Maybe<Company>;
  addEndorsement?: Maybe<Endorsement>;
  addFavoriteProject?: Maybe<Members>;
  addMemory?: Maybe<MemoryPinecone>;
  addMessage?: Maybe<Ai>;
  addMessages?: Maybe<Array<Maybe<Ai>>>;
  addNewChat?: Maybe<Chats>;
  addNewMember?: Maybe<Members>;
  addNodesToGrant?: Maybe<GrantTemplate>;
  addNodesToMember?: Maybe<Members>;
  addNodesToMemberInRoom?: Maybe<Members>;
  addNodesToPosition?: Maybe<Position>;
  addNodesToProjectRole?: Maybe<Project>;
  addPreferencesToMember?: Maybe<Members>;
  addProjectRole?: Maybe<Project>;
  addQuestionToEdenAI?: Maybe<AddQuestionToEdenAiOutput>;
  addQuestionsToAskPosition?: Maybe<Position>;
  addReview?: Maybe<Review>;
  applyGrant?: Maybe<GrantTemplate>;
  approveTweet?: Maybe<Project>;
  autoCalculatePrioritiesAndQuestions?: Maybe<Position>;
  autoCreateCardsCandidatesAndScore?: Maybe<Position>;
  autoCreateCardsForPosition?: Maybe<Array<Maybe<CardMemory>>>;
  autoUpdateMemoryFromCV?: Maybe<AutoUpdateMemoryFromCvOutput>;
  autoUpdateMemoryFromPositionRequirments?: Maybe<AutoUpdateMemoryFromPositionRequirmentsOutput>;
  autoUpdatePositionCompInformation?: Maybe<Position>;
  autoUpdatePositionCompInformation_V2?: Maybe<Position>;
  autoUpdateUserInfoFromCV?: Maybe<AutoUpdateUserInfoFromCvOutput>;
  calculateReputation?: Maybe<Members>;
  calculateScoreCardCandidateToPosition?: Maybe<Array<Maybe<CardMemory>>>;
  changeTeamMember_Phase_Project?: Maybe<Project>;
  checkUsersForTGConnection?: Maybe<UpdateTgOutput>;
  connectMemoriesToKnowledgeGraph_V2?: Maybe<ConnectMemoriesToKnowledgeGraph_V2Output>;
  connectNeighborNodesKG?: Maybe<Array<Maybe<Node>>>;
  conversationCVPositionToReport?: Maybe<ConversationCvPositionToReportOutput>;
  createCardsCandidateForPosition?: Maybe<Array<Maybe<CardMemory>>>;
  createCardsForPosition?: Maybe<Array<Maybe<CardMemory>>>;
  createCoreMemories?: Maybe<CreateCoreMemoriesOutput>;
  createEndorsementLink?: Maybe<EndorsementLink>;
  createError?: Maybe<ErrorLog>;
  createFakeEndorsement?: Maybe<Endorsement>;
  createFakeReview?: Maybe<Review>;
  createFakeUser?: Maybe<Members>;
  createFakeUserCVnew?: Maybe<Members>;
  createMultipleFakeEndorsementAndReview?: Maybe<Scalars["Boolean"]>;
  createNewEpic?: Maybe<Epic>;
  createNewRole?: Maybe<Role>;
  createNewTeam?: Maybe<Team>;
  createNode?: Maybe<Node>;
  createNodeCategoryGroup?: Maybe<Node>;
  createNode_V2?: Maybe<Node>;
  createProject?: Maybe<Project>;
  createProjectUpdate?: Maybe<ProjectUpdate>;
  createRoom?: Maybe<Rooms>;
  createTalentListPosition?: Maybe<Position>;
  cvMapKG?: Maybe<CvMapKgOutput>;
  deleteAllEndorsements?: Maybe<Scalars["Boolean"]>;
  deleteCardMemory?: Maybe<Array<Maybe<CardMemory>>>;
  deleteError?: Maybe<ErrorLog>;
  deleteMember?: Maybe<Members>;
  deleteMemories?: Maybe<Array<Maybe<MemoryPinecone>>>;
  deleteNodes?: Maybe<Array<Maybe<Node>>>;
  deleteNodesFromMember?: Maybe<Members>;
  deleteNodesFromMemberInRoom?: Maybe<Members>;
  deleteNodesToProjectRole?: Maybe<Project>;
  deletePositionCandidate?: Maybe<Array<Maybe<CandidateType>>>;
  deleteProject?: Maybe<Project>;
  deleteQueryResponse?: Maybe<QueryResponse>;
  deleteQuestionsToAskPosition?: Maybe<Position>;
  editCardMemory?: Maybe<Array<Maybe<CardMemory>>>;
  endorseAttribute?: Maybe<Members>;
  enterRoom?: Maybe<Rooms>;
  exitRoom?: Maybe<Rooms>;
  findEndorsements?: Maybe<Array<Maybe<Endorsement>>>;
  findKeyAttributeAndPotentialCandidate?: Maybe<Position>;
  findKeyAttributeAndPotentialPosition?: Maybe<Position>;
  findReviews?: Maybe<Array<Maybe<Review>>>;
  initiateConnectionTelegram?: Maybe<UpdateTgOutput>;
  inputToGPT?: Maybe<InputToGptOutput>;
  interviewQuestionCreationUser?: Maybe<Position>;
  login: User;
  messageToGPT?: Maybe<MessageToGptOutput>;
  moveCandidateToPosition?: Maybe<Position>;
  moveCandidateToPosition_V2?: Maybe<Position>;
  moveCandidateToPosition_V3?: Maybe<Position>;
  newTweetProject?: Maybe<TweetsProject>;
  pitchPositionToCandidate?: Maybe<PitchPositionToCandidateOutput>;
  positionSuggestQuestionsAskCandidate?: Maybe<PositionSuggestQuestionsAskCandidateOutput>;
  positionTextAndConvoToReportCriteria?: Maybe<PositionTextAndConvoToReportCriteriaOutput>;
  positionTextToExtraQuestions?: Maybe<PositionTextToExtraQuestionsOutput>;
  reCreateMemberNeo?: Maybe<Array<Maybe<Members>>>;
  rejectionLetter?: Maybe<RejectionLetterOutput>;
  relatedNode?: Maybe<Node>;
  relatedNode_name?: Maybe<Node>;
  respondToQuery?: Maybe<QueryResponse>;
  saveActionsPerformed?: Maybe<Scalars["Boolean"]>;
  saveCVtoUser?: Maybe<SaveCVtoUserOutput>;
  saveCoreProductFeatureInteration?: Maybe<Scalars["Boolean"]>;
  saveDailyLogin?: Maybe<Scalars["Boolean"]>;
  secondInterviewLetter?: Maybe<SecondInterviewLetterOutput>;
  showMembersConnectedToNodes?: Maybe<
    Array<Maybe<ShowMembersConnectedToNodesOutput>>
  >;
  storeLongTermMemory?: Maybe<StoreLongTermMemoryOutput>;
  storeLongTermMemorySummary?: Maybe<StoreLongTermMemorySummaryOutput>;
  submitCandidatePosition?: Maybe<Position>;
  subscribeToCommunity?: Maybe<Company>;
  talkToEdenGeneral_V1?: Maybe<TalkToEdenGeneral_V1Output>;
  textToPrimitivesAndTalent?: Maybe<
    Array<Maybe<ShowMembersConnectedToNodesOutput>>
  >;
  transcribeAudioToText?: Maybe<TranscribeAudioToTextOutput>;
  updateAnalysisEdenAICandidates?: Maybe<Array<Maybe<Position>>>;
  updateChatReply?: Maybe<Chats>;
  updateChatResult?: Maybe<Chats>;
  updateCompany?: Maybe<Company>;
  updateCompanyDetails?: Maybe<Company>;
  updateConvSummaries?: Maybe<Array<Maybe<Conversation>>>;
  updateConversation?: Maybe<Conversation>;
  updateGrant?: Maybe<GrantTemplate>;
  updateMember?: Maybe<Members>;
  updateMemberInRoom?: Maybe<Members>;
  updateMemberSignalInfo?: Maybe<Members>;
  updateMessage?: Maybe<Ai>;
  updateNodesToGrant?: Maybe<GrantTemplate>;
  updateNodesToMember?: Maybe<Members>;
  updateNodesToMemberInRoom?: Maybe<Members>;
  updateNodesToMemberMultiTypeNode?: Maybe<Members>;
  updateNodesToProjectRole?: Maybe<Project>;
  updatePosition?: Maybe<Position>;
  updatePositionConvRecruiter?: Maybe<Array<Maybe<Position>>>;
  updatePositionGeneralDetails?: Maybe<Position>;
  updatePositionUserAnswers?: Maybe<Array<Maybe<Position>>>;
  updatePrioritiesTradeOffs?: Maybe<UpdatePrioritiesTradeOffsOutput>;
  updateProject?: Maybe<Project>;
  updateQueryResponse?: Maybe<QueryResponse>;
  updateRoleTemplate?: Maybe<RoleTemplate>;
  updateServer?: Maybe<ServerTemplate>;
  updateStateEdenChat?: Maybe<Members>;
  updateUrl?: Maybe<Position>;
  updateUrlCompany?: Maybe<Company>;
  updateUsersTalentListPosition?: Maybe<Position>;
  uploadUserDataGPT?: Maybe<Members>;
  useAI_OnMessage?: Maybe<UseAi_OnMessageOutput>;
  websiteToMemoryCompany?: Maybe<WebsiteToMemoryCompanyOutput>;
};

export type MutationCVtoJobsArgs = {
  fields?: InputMaybe<CVtoJobsInput>;
};

export type MutationCVtoSummaryArgs = {
  fields?: InputMaybe<CVtoSummaryInput>;
};

export type MutationAddCandidatesPositionArgs = {
  fields?: InputMaybe<AddCandidatesPositionInput>;
};

export type MutationAddCardMemoryArgs = {
  fields?: InputMaybe<AddCardMemoryInput>;
};

export type MutationAddChatExternalAppArgs = {
  fields?: InputMaybe<AddChatExternalAppInput>;
};

export type MutationAddConvRecruiterToPositionArgs = {
  fields?: InputMaybe<AddConvRecruiterToPositionInput>;
};

export type MutationAddEmployeesCompanyArgs = {
  fields?: InputMaybe<AddEmployeesCompanyInput>;
};

export type MutationAddEndorsementArgs = {
  fields?: InputMaybe<AddEndorsementInput>;
};

export type MutationAddFavoriteProjectArgs = {
  fields: AddFavoriteProjectInput;
};

export type MutationAddMemoryArgs = {
  fields?: InputMaybe<AddMemoryInput>;
};

export type MutationAddMessageArgs = {
  fields?: InputMaybe<AddMessageInput>;
};

export type MutationAddMessagesArgs = {
  fields?: InputMaybe<AddMessagesInput>;
};

export type MutationAddNewChatArgs = {
  fields?: InputMaybe<AddNewChatInput>;
};

export type MutationAddNewMemberArgs = {
  fields: AddNewMemberInput;
};

export type MutationAddNodesToGrantArgs = {
  fields?: InputMaybe<AddNodesToGrantInput>;
};

export type MutationAddNodesToMemberArgs = {
  fields: AddNodesToMemberInput;
};

export type MutationAddNodesToMemberInRoomArgs = {
  fields?: InputMaybe<AddNodesToMemberInRoomInput>;
};

export type MutationAddNodesToPositionArgs = {
  fields?: InputMaybe<AddNodesToPositionInput>;
};

export type MutationAddNodesToProjectRoleArgs = {
  fields: AddNodesToProjectRoleInput;
};

export type MutationAddPreferencesToMemberArgs = {
  fields: AddPreferencesToMemberInput;
};

export type MutationAddProjectRoleArgs = {
  fields: AddProjectRoleInput;
};

export type MutationAddQuestionToEdenAiArgs = {
  fields?: InputMaybe<AddQuestionToEdenAiInput>;
};

export type MutationAddQuestionsToAskPositionArgs = {
  fields?: InputMaybe<AddQuestionsToAskPositionInput>;
};

export type MutationAddReviewArgs = {
  fields?: InputMaybe<AddReviewInput>;
};

export type MutationApplyGrantArgs = {
  fields?: InputMaybe<ApplyGrantInput>;
};

export type MutationApproveTweetArgs = {
  fields: ApproveTweetInput;
};

export type MutationAutoCalculatePrioritiesAndQuestionsArgs = {
  fields?: InputMaybe<AutoCalculatePrioritiesAndQuestionsInput>;
};

export type MutationAutoCreateCardsCandidatesAndScoreArgs = {
  fields?: InputMaybe<AutoCreateCardsCandidatesAndScoreInput>;
};

export type MutationAutoCreateCardsForPositionArgs = {
  fields?: InputMaybe<AutoCreateCardsForPositionInput>;
};

export type MutationAutoUpdateMemoryFromCvArgs = {
  fields?: InputMaybe<AutoUpdateMemoryFromCvInput>;
};

export type MutationAutoUpdateMemoryFromPositionRequirmentsArgs = {
  fields?: InputMaybe<AutoUpdateMemoryFromPositionRequirmentsInput>;
};

export type MutationAutoUpdatePositionCompInformationArgs = {
  fields?: InputMaybe<AutoUpdatePositionCompInformationInput>;
};

export type MutationAutoUpdatePositionCompInformation_V2Args = {
  fields?: InputMaybe<AutoUpdatePositionCompInformationInput>;
};

export type MutationAutoUpdateUserInfoFromCvArgs = {
  fields?: InputMaybe<AutoUpdateUserInfoFromCvInput>;
};

export type MutationCalculateReputationArgs = {
  fields?: InputMaybe<CalculateReputationInput>;
};

export type MutationCalculateScoreCardCandidateToPositionArgs = {
  fields?: InputMaybe<CalculateScoreCardCandidateToPositionInput>;
};

export type MutationChangeTeamMember_Phase_ProjectArgs = {
  fields: ChangeTeamMember_Phase_ProjectInput;
};

export type MutationCheckUsersForTgConnectionArgs = {
  fields?: InputMaybe<CheckUsersForTgConnectionInput>;
};

export type MutationConnectMemoriesToKnowledgeGraph_V2Args = {
  fields?: InputMaybe<ConnectMemoriesToKnowledgeGraph_V2Input>;
};

export type MutationConnectNeighborNodesKgArgs = {
  fields?: InputMaybe<ConnectNeighborNodesKgInput>;
};

export type MutationConversationCvPositionToReportArgs = {
  fields?: InputMaybe<ConversationCvPositionToReportInput>;
};

export type MutationCreateCardsCandidateForPositionArgs = {
  fields?: InputMaybe<CreateCardsCandidateForPositionInput>;
};

export type MutationCreateCardsForPositionArgs = {
  fields?: InputMaybe<CreateCardsForPositionInput>;
};

export type MutationCreateCoreMemoriesArgs = {
  fields?: InputMaybe<CreateCoreMemoriesInput>;
};

export type MutationCreateEndorsementLinkArgs = {
  fields?: InputMaybe<CreateEndorsementLinkInput>;
};

export type MutationCreateErrorArgs = {
  fields: CreateErrorInput;
};

export type MutationCreateFakeEndorsementArgs = {
  fields?: InputMaybe<CreateFakeEndorsementInput>;
};

export type MutationCreateFakeReviewArgs = {
  fields?: InputMaybe<CreateFakeReviewInput>;
};

export type MutationCreateFakeUserArgs = {
  fields?: InputMaybe<CreateFakeUserInput>;
};

export type MutationCreateFakeUserCVnewArgs = {
  fields?: InputMaybe<CreateFakeUserCVnewInput>;
};

export type MutationCreateMultipleFakeEndorsementAndReviewArgs = {
  fields?: InputMaybe<CreateMultipleFakeEndorsementAndReviewInput>;
};

export type MutationCreateNewEpicArgs = {
  fields: CreateNewEpicInput;
};

export type MutationCreateNewRoleArgs = {
  fields: CreateNewRoleInput;
};

export type MutationCreateNewTeamArgs = {
  fields: CreateNewTeamInput;
};

export type MutationCreateNodeArgs = {
  fields?: InputMaybe<CreateNodeInput>;
};

export type MutationCreateNodeCategoryGroupArgs = {
  fields?: InputMaybe<CreateNodeCategoryGroupInput>;
};

export type MutationCreateNode_V2Args = {
  fields?: InputMaybe<CreateNode_V2Input>;
};

export type MutationCreateProjectArgs = {
  fields?: InputMaybe<CreateProjectInput>;
};

export type MutationCreateProjectUpdateArgs = {
  fields: CreateProjectUpdateInput;
};

export type MutationCreateRoomArgs = {
  fields: CreateRoomInput;
};

export type MutationCreateTalentListPositionArgs = {
  fields?: InputMaybe<CreateTalentListPositionInput>;
};

export type MutationCvMapKgArgs = {
  fields?: InputMaybe<CvMapKgInput>;
};

export type MutationDeleteAllEndorsementsArgs = {
  fields?: InputMaybe<DeleteAllEndorsementsInput>;
};

export type MutationDeleteCardMemoryArgs = {
  fields?: InputMaybe<DeleteCardMemoryInput>;
};

export type MutationDeleteErrorArgs = {
  fields: DeleteErrorInput;
};

export type MutationDeleteMemberArgs = {
  fields: DeleteMemberInput;
};

export type MutationDeleteMemoriesArgs = {
  fields?: InputMaybe<DeleteMemoriesInput>;
};

export type MutationDeleteNodesArgs = {
  fields?: InputMaybe<DeleteNodeInput>;
};

export type MutationDeleteNodesFromMemberArgs = {
  fields: DeleteNodesFromMemberInput;
};

export type MutationDeleteNodesFromMemberInRoomArgs = {
  fields?: InputMaybe<DeleteNodesFromMemberInRoomInput>;
};

export type MutationDeleteNodesToProjectRoleArgs = {
  fields: DeleteNodesToProjectRoleInput;
};

export type MutationDeletePositionCandidateArgs = {
  fields?: InputMaybe<DeletePositionCandidateInput>;
};

export type MutationDeleteProjectArgs = {
  fields?: InputMaybe<DeleteProjectInput>;
};

export type MutationDeleteQueryResponseArgs = {
  fields?: InputMaybe<DeleteQueryResponseInput>;
};

export type MutationDeleteQuestionsToAskPositionArgs = {
  fields?: InputMaybe<DeleteQuestionsToAskPositionInput>;
};

export type MutationEditCardMemoryArgs = {
  fields?: InputMaybe<EditCardMemoryInput>;
};

export type MutationEndorseAttributeArgs = {
  fields: EndorseAttributeInput;
};

export type MutationEnterRoomArgs = {
  fields: EnterRoomInput;
};

export type MutationExitRoomArgs = {
  fields: EnterRoomInput;
};

export type MutationFindEndorsementsArgs = {
  fields?: InputMaybe<FindEndorsementsInput>;
};

export type MutationFindKeyAttributeAndPotentialCandidateArgs = {
  fields?: InputMaybe<FindKeyAttributeAndPotentialCandidateInput>;
};

export type MutationFindKeyAttributeAndPotentialPositionArgs = {
  fields?: InputMaybe<FindKeyAttributeAndPotentialPositionInput>;
};

export type MutationFindReviewsArgs = {
  fields?: InputMaybe<FindReviewsInput>;
};

export type MutationInitiateConnectionTelegramArgs = {
  fields?: InputMaybe<InitiateConnectionTelegramInput>;
};

export type MutationInputToGptArgs = {
  fields?: InputMaybe<InputToGptInput>;
};

export type MutationInterviewQuestionCreationUserArgs = {
  fields?: InputMaybe<InterviewQuestionCreationUserInput>;
};

export type MutationLoginArgs = {
  fields: LoginInput;
};

export type MutationMessageToGptArgs = {
  fields?: InputMaybe<MessageToGptInput>;
};

export type MutationMoveCandidateToPositionArgs = {
  fields?: InputMaybe<MoveCandidateToPositionInput>;
};

export type MutationMoveCandidateToPosition_V2Args = {
  fields?: InputMaybe<MoveCandidateToPosition_V2Input>;
};

export type MutationMoveCandidateToPosition_V3Args = {
  fields?: InputMaybe<MoveCandidateToPosition_V3Input>;
};

export type MutationNewTweetProjectArgs = {
  fields: NewTweetProjectInput;
};

export type MutationPitchPositionToCandidateArgs = {
  fields?: InputMaybe<PitchPositionToCandidateInput>;
};

export type MutationPositionSuggestQuestionsAskCandidateArgs = {
  fields?: InputMaybe<PositionSuggestQuestionsAskCandidateInput>;
};

export type MutationPositionTextAndConvoToReportCriteriaArgs = {
  fields?: InputMaybe<PositionTextAndConvoToReportCriteriaInput>;
};

export type MutationPositionTextToExtraQuestionsArgs = {
  fields?: InputMaybe<PositionTextToExtraQuestionsInput>;
};

export type MutationReCreateMemberNeoArgs = {
  fields?: InputMaybe<ReCreateMemberNeoInput>;
};

export type MutationRejectionLetterArgs = {
  fields?: InputMaybe<RejectionLetterInput>;
};

export type MutationRelatedNodeArgs = {
  fields?: InputMaybe<RelatedNodeInput>;
};

export type MutationRelatedNode_NameArgs = {
  fields?: InputMaybe<RelatedNode_NameInput>;
};

export type MutationRespondToQueryArgs = {
  fields?: InputMaybe<RespondToQueryInput>;
};

export type MutationSaveActionsPerformedArgs = {
  fields?: InputMaybe<SaveActionsPerformedInput>;
};

export type MutationSaveCVtoUserArgs = {
  fields?: InputMaybe<SaveCVtoUserInput>;
};

export type MutationSaveCoreProductFeatureInterationArgs = {
  fields?: InputMaybe<SaveCoreProductFeatureInterationInput>;
};

export type MutationSaveDailyLoginArgs = {
  fields?: InputMaybe<SaveDailyLoginInput>;
};

export type MutationSecondInterviewLetterArgs = {
  fields?: InputMaybe<SecondInterviewLetterInput>;
};

export type MutationShowMembersConnectedToNodesArgs = {
  fields?: InputMaybe<ShowMembersConnectedToNodesInput>;
};

export type MutationStoreLongTermMemoryArgs = {
  fields?: InputMaybe<StoreLongTermMemoryInput>;
};

export type MutationStoreLongTermMemorySummaryArgs = {
  fields?: InputMaybe<StoreLongTermMemorySummaryInput>;
};

export type MutationSubmitCandidatePositionArgs = {
  fields?: InputMaybe<SubmitCandidatePositionInput>;
};

export type MutationSubscribeToCommunityArgs = {
  fields?: InputMaybe<SubscribeToCommunityInput>;
};

export type MutationTalkToEdenGeneral_V1Args = {
  fields?: InputMaybe<TalkToEdenGeneral_V1Input>;
};

export type MutationTextToPrimitivesAndTalentArgs = {
  fields?: InputMaybe<TextToPrimitivesAndTalentInput>;
};

export type MutationTranscribeAudioToTextArgs = {
  fields?: InputMaybe<TranscribeAudioToTextInput>;
};

export type MutationUpdateAnalysisEdenAiCandidatesArgs = {
  fields?: InputMaybe<UpdateAnalysisEdenAiCandidatesInput>;
};

export type MutationUpdateChatReplyArgs = {
  fields?: InputMaybe<UpdateChatReplyInput>;
};

export type MutationUpdateChatResultArgs = {
  fields?: InputMaybe<UpdateChatResultInput>;
};

export type MutationUpdateCompanyArgs = {
  fields?: InputMaybe<UpdateCompanyInput>;
};

export type MutationUpdateCompanyDetailsArgs = {
  fields?: InputMaybe<UpdateCompanyDetailsInput>;
};

export type MutationUpdateConvSummariesArgs = {
  fields?: InputMaybe<UpdateConvSummariesInput>;
};

export type MutationUpdateConversationArgs = {
  fields?: InputMaybe<UpdateConversationInput>;
};

export type MutationUpdateGrantArgs = {
  fields?: InputMaybe<UpdateGrantInput>;
};

export type MutationUpdateMemberArgs = {
  fields: UpdateMemberInput;
};

export type MutationUpdateMemberInRoomArgs = {
  fields?: InputMaybe<UpdateMemberInRoomInput>;
};

export type MutationUpdateMemberSignalInfoArgs = {
  fields?: InputMaybe<UpdateMemberSignalInfoInput>;
};

export type MutationUpdateMessageArgs = {
  fields?: InputMaybe<UpdateMessageInput>;
};

export type MutationUpdateNodesToGrantArgs = {
  fields?: InputMaybe<UpdateNodesToGrantInput>;
};

export type MutationUpdateNodesToMemberArgs = {
  fields: UpdateNodesToMemberInput;
};

export type MutationUpdateNodesToMemberInRoomArgs = {
  fields?: InputMaybe<UpdateNodesToMemberInRoomInput>;
};

export type MutationUpdateNodesToMemberMultiTypeNodeArgs = {
  fields: UpdateNodesToMemberMultiTypeNodeInput;
};

export type MutationUpdateNodesToProjectRoleArgs = {
  fields: UpdateNodesToProjectRoleInput;
};

export type MutationUpdatePositionArgs = {
  fields?: InputMaybe<UpdatePositionInput>;
};

export type MutationUpdatePositionConvRecruiterArgs = {
  fields?: InputMaybe<UpdatePositionConvRecruiterInput>;
};

export type MutationUpdatePositionGeneralDetailsArgs = {
  fields?: InputMaybe<UpdatePositionGeneralDetailsInput>;
};

export type MutationUpdatePositionUserAnswersArgs = {
  fields?: InputMaybe<UpdatePositionUserAnswersInput>;
};

export type MutationUpdatePrioritiesTradeOffsArgs = {
  fields?: InputMaybe<UpdatePrioritiesTradeOffsInput>;
};

export type MutationUpdateProjectArgs = {
  fields: UpdateProjectInput;
};

export type MutationUpdateQueryResponseArgs = {
  fields?: InputMaybe<UpdateQueryResponseInput>;
};

export type MutationUpdateRoleTemplateArgs = {
  fields?: InputMaybe<CreateRoleInput>;
};

export type MutationUpdateServerArgs = {
  fields?: InputMaybe<UpdateServerInput>;
};

export type MutationUpdateStateEdenChatArgs = {
  fields?: InputMaybe<UpdateStateEdenChatInput>;
};

export type MutationUpdateUrlArgs = {
  fields?: InputMaybe<UpdateUrlInput>;
};

export type MutationUpdateUrlCompanyArgs = {
  fields?: InputMaybe<UpdateUrlInput>;
};

export type MutationUpdateUsersTalentListPositionArgs = {
  fields?: InputMaybe<UpdateUsersTalentListPositionInput>;
};

export type MutationUploadUserDataGptArgs = {
  fields?: InputMaybe<UploadUserDataGptInput>;
};

export type MutationUseAi_OnMessageArgs = {
  fields?: InputMaybe<UseAi_OnMessageInput>;
};

export type MutationWebsiteToMemoryCompanyArgs = {
  fields?: InputMaybe<WebsiteToMemoryCompanyInput>;
};

export type NeighborNodeWithMem = {
  __typename?: "NeighborNodeWithMem";
  cardMemoryOutput?: Maybe<CardMemory>;
  nodeOutput?: Maybe<Node>;
  scoreCard?: Maybe<Scalars["Float"]>;
  scoreNode?: Maybe<Scalars["Float"]>;
  scoreTotal?: Maybe<Scalars["Float"]>;
};

export type Node = {
  __typename?: "Node";
  _id?: Maybe<Scalars["ID"]>;
  aboveNodes?: Maybe<Array<Maybe<Node>>>;
  categoryNodes?: Maybe<Array<Maybe<Node>>>;
  cleanName?: Maybe<Scalars["String"]>;
  connectedCardMemories?: Maybe<Array<Maybe<ConnectedCardMemory>>>;
  connectedNodes?: Maybe<Array<Maybe<ConnectedNodes>>>;
  graphNeighbors?: Maybe<Array<Maybe<GraphNeighborType>>>;
  groupNodes?: Maybe<Array<Maybe<Node>>>;
  level?: Maybe<Scalars["Int"]>;
  match_v2?: Maybe<Array<Maybe<Match_V2Type>>>;
  match_v2_update?: Maybe<Match_V2_UpdateType>;
  name?: Maybe<Scalars["String"]>;
  node?: Maybe<Scalars["String"]>;
  open?: Maybe<Scalars["Boolean"]>;
  pineconeID?: Maybe<Scalars["String"]>;
  registeredAt?: Maybe<Scalars["String"]>;
  relatedNodes?: Maybe<Array<Maybe<Node>>>;
  selected?: Maybe<Scalars["Boolean"]>;
  star?: Maybe<Scalars["Boolean"]>;
  state?: Maybe<StateEnum>;
  subNodes?: Maybe<Array<Maybe<Node>>>;
};

export type NodeDataType = {
  __typename?: "NodeDataType";
  nodeData?: Maybe<Node>;
};

export type NodeOutputType = {
  __typename?: "NodeOutputType";
  node?: Maybe<Node>;
  scoreCard?: Maybe<Scalars["Float"]>;
  scoreHop?: Maybe<Scalars["Float"]>;
  scoreNode?: Maybe<Scalars["Float"]>;
  scoreTotal?: Maybe<Scalars["Float"]>;
};

export type NodeVisual = {
  __typename?: "NodeVisual";
  _id?: Maybe<Scalars["ID"]>;
  avatar?: Maybe<Scalars["String"]>;
  comboId?: Maybe<Scalars["String"]>;
  extraDistanceRation?: Maybe<Scalars["Float"]>;
  fakeID?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  name?: Maybe<Scalars["String"]>;
  originalNode?: Maybe<Scalars["ID"]>;
  style?: Maybe<StyleNodeOut>;
  type?: Maybe<Scalars["String"]>;
};

export type PageInfo = {
  __typename?: "PageInfo";
  currentPage?: Maybe<Scalars["Int"]>;
  end?: Maybe<Scalars["String"]>;
  hasNextPage?: Maybe<Scalars["Boolean"]>;
  hasPrevPage?: Maybe<Scalars["Boolean"]>;
  start?: Maybe<Scalars["String"]>;
  totalPages?: Maybe<Scalars["Int"]>;
  totalResults?: Maybe<Scalars["Int"]>;
};

export type PaginatedErrorLogs = {
  __typename?: "PaginatedErrorLogs";
  errorsData?: Maybe<Array<Maybe<ErrorLog>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedMessages = {
  __typename?: "PaginatedMessages";
  data?: Maybe<Array<Maybe<Ai>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PaginatedRooms = {
  __typename?: "PaginatedRooms";
  pageInfo?: Maybe<PageInfo>;
  roomsData?: Maybe<Array<Maybe<Rooms>>>;
};

export type PaginatedSkills = {
  __typename?: "PaginatedSkills";
  data?: Maybe<Array<Maybe<Skills>>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Position = {
  __typename?: "Position";
  _id?: Maybe<Scalars["ID"]>;
  allCandidateScoreCardCalculated?: Maybe<Scalars["Boolean"]>;
  candidates?: Maybe<Array<Maybe<CandidateType>>>;
  candidatesFlagAnalysisCreated?: Maybe<Scalars["Boolean"]>;
  candidatesReadyToDisplay?: Maybe<Scalars["Boolean"]>;
  cardsPositionCalculated?: Maybe<Scalars["Boolean"]>;
  company?: Maybe<Company>;
  conduct?: Maybe<ConductType>;
  convRecruiter?: Maybe<Array<Maybe<ConvRecruiterType>>>;
  convRecruiterReadyToDisplay?: Maybe<Scalars["Boolean"]>;
  generalDetails?: Maybe<GeneralDetailsType>;
  icon?: Maybe<Scalars["String"]>;
  interviewQuestionsForPosition?: Maybe<
    Array<Maybe<InterviewQuestionsForCandidateType>>
  >;
  mainUser?: Maybe<Members>;
  memory?: Maybe<MemoryPositionType>;
  name?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<NodeDataType>>>;
  positionsRequirements?: Maybe<PositionsRequirementsType>;
  prioritiesPositionCalculated?: Maybe<Scalars["Boolean"]>;
  questionsToAsk?: Maybe<Array<Maybe<QuestionType>>>;
  status?: Maybe<PositionStatus>;
  talentList?: Maybe<Array<Maybe<TalentListType>>>;
  url?: Maybe<Scalars["String"]>;
  whatTheJobInvolves?: Maybe<Scalars["String"]>;
  whatsToLove?: Maybe<Scalars["String"]>;
  whoYouAre?: Maybe<Scalars["String"]>;
};

export enum PositionStatus {
  Active = "ACTIVE",
  Archived = "ARCHIVED",
  Deleted = "DELETED",
  Unpublished = "UNPUBLISHED",
}

export type PrimitiveCardMemInput = {
  importance?: InputMaybe<Scalars["Int"]>;
  nodeID?: InputMaybe<Scalars["ID"]>;
};

export type PrimitiveCardMemType = {
  __typename?: "PrimitiveCardMemType";
  node?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
};

export type PrimitiveCardType = {
  __typename?: "PrimitiveCardType";
  cardMemoryInput?: Maybe<CardMemory>;
  cardMemoryOutput?: Maybe<Array<Maybe<CardMemoryOutputType>>>;
  neighborNodeWithMemOutput?: Maybe<Array<Maybe<NeighborNodeWithMem>>>;
  nodeInput?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
  scoreReal?: Maybe<Scalars["Float"]>;
};

export type PrimitiveInput = {
  score?: InputMaybe<Scalars["Float"]>;
  type?: InputMaybe<Scalars["String"]>;
};

export type PrimitivesType = {
  __typename?: "PrimitivesType";
  node?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
};

export type Project = {
  __typename?: "Project";
  _id?: Maybe<Scalars["ID"]>;
  backColorEmoji?: Maybe<Scalars["String"]>;
  budget?: Maybe<BudgetType>;
  champion?: Maybe<Members>;
  collaborationLinks?: Maybe<Array<Maybe<CollaborationLinksType>>>;
  dates?: Maybe<DatesType>;
  description?: Maybe<Scalars["String"]>;
  descriptionOneLine?: Maybe<Scalars["String"]>;
  emoji?: Maybe<Scalars["String"]>;
  gardenServerID?: Maybe<Scalars["String"]>;
  garden_teams?: Maybe<Array<Maybe<Team>>>;
  role?: Maybe<Array<Maybe<RoleType>>>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  stepsJoinProject?: Maybe<Array<Maybe<Scalars["String"]>>>;
  team?: Maybe<Array<Maybe<TeamType>>>;
  title?: Maybe<Scalars["String"]>;
  tweets?: Maybe<Array<Maybe<TweetsType>>>;
};

export type ProjectUpdate = {
  __typename?: "ProjectUpdate";
  _id?: Maybe<Scalars["ID"]>;
  author?: Maybe<Members>;
  champion?: Maybe<Members>;
  content?: Maybe<Scalars["String"]>;
  deWorkLink?: Maybe<Scalars["String"]>;
  deadline?: Maybe<Scalars["String"]>;
  epic?: Maybe<Epic>;
  members?: Maybe<Array<Maybe<Members>>>;
  notifyUsers?: Maybe<Array<Maybe<Members>>>;
  phase?: Maybe<PhaseEpicType>;
  priority?: Maybe<Scalars["Int"]>;
  projects?: Maybe<Project>;
  registeredAt?: Maybe<Scalars["String"]>;
  role?: Maybe<Array<Maybe<Role>>>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  task?: Maybe<ProjectUpdate>;
  team?: Maybe<Array<Maybe<Team>>>;
  threadDiscordID?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
};

export type Query = {
  __typename?: "Query";
  activeMembersStats?: Maybe<Array<Maybe<ResultCount>>>;
  activeUsersQueryStats?: Maybe<Array<Maybe<ResultCount2>>>;
  adminFindAllSkillsEveryState?: Maybe<Array<Maybe<Skills>>>;
  askEdenUserPosition?: Maybe<AskEdenUserPositionOutput>;
  askEdenUserPositionGPTFunc?: Maybe<AskEdenUserPositionGptFuncOutput>;
  askEdenUserPositionGPTFunc_V2?: Maybe<AskEdenUserPositionGptFunc_V2Output>;
  candidateNotesComparePositionEdenAI?: Maybe<
    Array<Maybe<CandidateNotesComparePositionEdenAiOutput>>
  >;
  candidateNotesEdenAI?: Maybe<Array<Maybe<CandidateNotesEdenAiOutput>>>;
  checkLimitMessagesExternalApp?: Maybe<CheckLimitMessagesExternalAppOutput>;
  conversationToSummaryGPT?: Maybe<ConversationToSummaryGptOutput>;
  createProfileExperienceWithChatCVMemory?: Maybe<CreateProfileExperienceWithChatCvMemoryOutput>;
  dynamicSearchGraph?: Maybe<Graph>;
  dynamicSearchToMemberCategoryGroup?: Maybe<Graph>;
  dynamicSearchToMemberGraph?: Maybe<Graph>;
  dynamicSearchToMemberGraphGPT?: Maybe<Graph>;
  dynamicSearchToMemberGraphV2?: Maybe<Graph>;
  dynamicSearchToProjectGraph?: Maybe<Graph>;
  edenAITalSearchExpirience?: Maybe<EdenAiTalSearchExpirienceOutput>;
  edenGPTCreateProfileExperienceChatAPI?: Maybe<EdenGptCreateProfileExperienceChatApiOutput>;
  edenGPTEndorseChatAPI?: Maybe<EdenGptEndorseChatApiOutput>;
  edenGPTReviewChatAPI?: Maybe<EdenGptReviewChatApiOutput>;
  edenGPTreply?: Maybe<EdenGpTreplyOutput>;
  edenGPTreplyChatAPI?: Maybe<EdenGpTreplyChatApiOutput>;
  edenGPTreplyChatAPI_V2?: Maybe<EdenGpTreplyChatApi_V2Output>;
  edenGPTreplyChatAPI_V3?: Maybe<EdenGpTreplyChatApi_V3Output>;
  edenGPTreplyMemory?: Maybe<EdenGpTreplyMemoryOutput>;
  edenGPTsearchProfiles?: Maybe<EdenGpTsearchProfilesOutput>;
  edenGPTsummaryProfile?: Maybe<EdenGpTsummaryProfileOutput>;
  errors?: Maybe<PaginatedErrorLogs>;
  evaluateAnswerEdenAI?: Maybe<EvaluateAnswerEdenAiOutput>;
  findAllProjectsTeamsAnouncments?: Maybe<
    Array<Maybe<FindAllProjectsTeamsAnouncmentsOutput>>
  >;
  findCandidateInfoForMember?: Maybe<Array<Maybe<CandidateType>>>;
  findCardMemories?: Maybe<Array<Maybe<CardMemory>>>;
  findChat?: Maybe<Chats>;
  findCompanies?: Maybe<Array<Maybe<Company>>>;
  findCompany?: Maybe<Company>;
  findCompanyFromSlug?: Maybe<Company>;
  findConversation?: Maybe<Conversation>;
  findConversations?: Maybe<Array<Maybe<Conversation>>>;
  findEndorsementLink?: Maybe<Array<Maybe<EndorsementLink>>>;
  findEpic?: Maybe<Array<Maybe<Epic>>>;
  findGarden?: Maybe<Array<Maybe<FindGardenOutput>>>;
  findGrants?: Maybe<Array<Maybe<GrantTemplate>>>;
  findLastNumMessagesChatExternalApp?: Maybe<Array<Maybe<ChatExternalApp>>>;
  findMember?: Maybe<Members>;
  findMemberGraph?: Maybe<Graph>;
  findMemberToMemberGraph?: Maybe<Graph>;
  findMemberToProjectGraph?: Maybe<Graph>;
  findMembers?: Maybe<Array<Maybe<Members>>>;
  findMemories?: Maybe<Array<Maybe<MemoryPinecone>>>;
  findMessage?: Maybe<PaginatedMessages>;
  findMultipleMembersProjectsGraph?: Maybe<Graph>;
  findNode?: Maybe<Node>;
  findNodes?: Maybe<Array<Maybe<Node>>>;
  findOneMemberToMembersGraph?: Maybe<Graph>;
  findPosition?: Maybe<Position>;
  findPositionCandidate?: Maybe<CandidateType>;
  findPositions?: Maybe<Array<Maybe<Position>>>;
  findPositionsOfCommunity?: Maybe<Array<Maybe<Position>>>;
  findPrioritiesTrainEdenAI?: Maybe<FindPrioritiesTrainEdenAiOutput>;
  findProject?: Maybe<Project>;
  findProjectGraph?: Maybe<Graph>;
  findProjectUpdates?: Maybe<Array<Maybe<ProjectUpdate>>>;
  findProjects?: Maybe<Array<Maybe<Project>>>;
  findProjects_RecommendedToUser?: Maybe<Array<Maybe<ProjectMatchType>>>;
  findProjects_RequireSkill?: Maybe<Array<Maybe<Project>>>;
  findQueryResponses?: Maybe<Array<Maybe<QueryResponse>>>;
  findQuestionEdenAI?: Maybe<CardMemory>;
  findRoleTemplate?: Maybe<RoleTemplate>;
  findRoleTemplates?: Maybe<Array<Maybe<RoleTemplate>>>;
  findRoles?: Maybe<Array<Maybe<Role>>>;
  findRoom?: Maybe<Rooms>;
  findRooms?: Maybe<PaginatedRooms>;
  findServers?: Maybe<Array<Maybe<ServerTemplate>>>;
  findSkill?: Maybe<Skills>;
  findSkillCategories?: Maybe<Array<Maybe<SkillCategory>>>;
  findSkillCategory?: Maybe<SkillCategory>;
  findSkillSubCategories?: Maybe<Array<Maybe<SkillSubCategory>>>;
  findSkillSubCategory?: Maybe<SkillSubCategory>;
  findSkills?: Maybe<Array<Maybe<Skills>>>;
  findTeams?: Maybe<Array<Maybe<Team>>>;
  findUserTalentListPosition?: Maybe<TalentListType>;
  identifyCategoryAndReply?: Maybe<IdentifyCategoryAndReplyOutput>;
  interviewEdenAI?: Maybe<InterviewEdenAiOutput>;
  interviewEdenGPT4only?: Maybe<InterviewEdenGpt4onlyOutput>;
  lurkersContributorsQuery?: Maybe<LurkersAndContributors>;
  matchMembersToProject?: Maybe<Array<Maybe<MatchMembersToProjectOutput>>>;
  matchMembersToProjectRole?: Maybe<
    Array<Maybe<MatchMembersToProjectRoleOutput>>
  >;
  matchMembersToSkills?: Maybe<Array<Maybe<MatchMembersToSkillOutput>>>;
  matchMembersToUser?: Maybe<Array<Maybe<MatchMembersToUserOutput>>>;
  matchNodesToMembers?: Maybe<Array<Maybe<MatchMembersToSkillOutput>>>;
  matchNodesToMembers_AI4?: Maybe<Array<Maybe<MatchMembersToSkillOutput>>>;
  matchNodesToMembers_old?: Maybe<Array<Maybe<MatchMembersToSkillOutput>>>;
  matchNodesToProjectRoles?: Maybe<Array<Maybe<MatchSkillsToProjectsOutput>>>;
  matchNodesToProjectRoles_old?: Maybe<
    Array<Maybe<MatchSkillsToProjectsOutput>>
  >;
  matchPrepareNode?: Maybe<Node>;
  matchPrepareNode_AI4?: Maybe<Node>;
  matchPrepareNode_old?: Maybe<Node>;
  matchPrepareSkillToMembers?: Maybe<Skills>;
  matchPrepareSkillToProjectRoles?: Maybe<Skills>;
  matchProjectsToMember?: Maybe<Array<Maybe<Project>>>;
  matchSkillsToMembers?: Maybe<Array<Maybe<MatchMembersToSkillOutput>>>;
  matchSkillsToProjects?: Maybe<Array<Maybe<MatchSkillsToProjectsOutput>>>;
  match_projectToUser?: Maybe<ProjectUserMatchType>;
  memberPieChartNodeCategories?: Maybe<
    Array<Maybe<MemberPieChartNodeCategoriesOutput>>
  >;
  memberRadioChartCharacterAttributes?: Maybe<
    Array<Maybe<MemberRadioChartCharacterAttributesOutput>>
  >;
  membersStats?: Maybe<Array<Maybe<ResultCount>>>;
  members_autocomplete?: Maybe<Array<Maybe<Members>>>;
  messageMapKG?: Maybe<MessageMapKgOutput>;
  messageMapKG_V2?: Maybe<MessageMapKg_V2Output>;
  messageMapKG_V3?: Maybe<MessageMapKg_V3Output>;
  messageMapKG_V4?: Maybe<MessageMapKg_V4Output>;
  messageMapKG_V5?: Maybe<MessageMapKg_V5Output>;
  nodes_autocomplete?: Maybe<Array<Maybe<Node>>>;
  searchEden_V1?: Maybe<SearchEden_V1Output>;
  sendEmailViaSendGrid?: Maybe<Scalars["Boolean"]>;
  sendWhatsAppMessage?: Maybe<Scalars["Boolean"]>;
  setAllMatch_v2?: Maybe<Scalars["Boolean"]>;
  skills?: Maybe<PaginatedSkills>;
  skills_autocomplete?: Maybe<Array<Maybe<Skills>>>;
  treeOfRelatedNodes?: Maybe<Array<Maybe<Node>>>;
  waitingToAproveSkills?: Maybe<Array<Maybe<Skills>>>;
};

export type QueryActiveMembersStatsArgs = {
  fields?: InputMaybe<StatsInput>;
};

export type QueryActiveUsersQueryStatsArgs = {
  fields?: InputMaybe<ActiveUsersInput>;
};

export type QueryAdminFindAllSkillsEveryStateArgs = {
  fields?: InputMaybe<FindSkillsInput>;
};

export type QueryAskEdenUserPositionArgs = {
  fields?: InputMaybe<AskEdenUserPositionInput>;
};

export type QueryAskEdenUserPositionGptFuncArgs = {
  fields?: InputMaybe<AskEdenUserPositionGptFuncInput>;
};

export type QueryAskEdenUserPositionGptFunc_V2Args = {
  fields?: InputMaybe<AskEdenUserPositionGptFunc_V2Input>;
};

export type QueryCandidateNotesComparePositionEdenAiArgs = {
  fields?: InputMaybe<CandidateNotesComparePositionEdenAiInput>;
};

export type QueryCandidateNotesEdenAiArgs = {
  fields?: InputMaybe<CandidateNotesEdenAiInput>;
};

export type QueryCheckLimitMessagesExternalAppArgs = {
  fields?: InputMaybe<CheckLimitMessagesExternalAppInput>;
};

export type QueryConversationToSummaryGptArgs = {
  fields?: InputMaybe<ConversationToSummaryGptInput>;
};

export type QueryCreateProfileExperienceWithChatCvMemoryArgs = {
  fields?: InputMaybe<CreateProfileExperienceWithChatCvMemoryInput>;
};

export type QueryDynamicSearchGraphArgs = {
  fields?: InputMaybe<DynamicSearchGraphInput>;
};

export type QueryDynamicSearchToMemberCategoryGroupArgs = {
  fields?: InputMaybe<DynamicSearchToMemberCategoryGroupInput>;
};

export type QueryDynamicSearchToMemberGraphArgs = {
  fields?: InputMaybe<DynamicSearchToMemberGraphInput>;
};

export type QueryDynamicSearchToMemberGraphGptArgs = {
  fields?: InputMaybe<DynamicSearchToMemberGraphGptInput>;
};

export type QueryDynamicSearchToMemberGraphV2Args = {
  fields?: InputMaybe<DynamicSearchToMemberGraphV2Input>;
};

export type QueryDynamicSearchToProjectGraphArgs = {
  fields?: InputMaybe<DynamicSearchToProjectGraphInput>;
};

export type QueryEdenAiTalSearchExpirienceArgs = {
  fields?: InputMaybe<EdenAiTalSearchExpirienceInput>;
};

export type QueryEdenGptCreateProfileExperienceChatApiArgs = {
  fields?: InputMaybe<EdenGptCreateProfileExperienceChatApiInput>;
};

export type QueryEdenGptEndorseChatApiArgs = {
  fields?: InputMaybe<EdenGptEndorseChatApiInput>;
};

export type QueryEdenGptReviewChatApiArgs = {
  fields?: InputMaybe<EdenGptReviewChatApiInput>;
};

export type QueryEdenGpTreplyArgs = {
  fields?: InputMaybe<EdenGpTreplyInput>;
};

export type QueryEdenGpTreplyChatApiArgs = {
  fields?: InputMaybe<EdenGpTreplyChatApiInput>;
};

export type QueryEdenGpTreplyChatApi_V2Args = {
  fields?: InputMaybe<EdenGpTreplyChatApi_V2Input>;
};

export type QueryEdenGpTreplyChatApi_V3Args = {
  fields?: InputMaybe<EdenGpTreplyChatApi_V3Input>;
};

export type QueryEdenGpTreplyMemoryArgs = {
  fields?: InputMaybe<EdenGpTreplyMemoryInput>;
};

export type QueryEdenGpTsearchProfilesArgs = {
  fields?: InputMaybe<EdenGpTsearchProfilesInput>;
};

export type QueryEdenGpTsummaryProfileArgs = {
  fields?: InputMaybe<EdenGpTsummaryProfileInput>;
};

export type QueryErrorsArgs = {
  fields?: InputMaybe<ErrorsInput>;
};

export type QueryEvaluateAnswerEdenAiArgs = {
  fields?: InputMaybe<EvaluateAnswerEdenAiInput>;
};

export type QueryFindAllProjectsTeamsAnouncmentsArgs = {
  fields?: InputMaybe<FindAllProjectsTeamsAnouncmentsInput>;
};

export type QueryFindCandidateInfoForMemberArgs = {
  fields?: InputMaybe<FindCandidateInfoForMemberInput>;
};

export type QueryFindCardMemoriesArgs = {
  fields?: InputMaybe<FindCardMemoriesInput>;
};

export type QueryFindChatArgs = {
  fields?: InputMaybe<FindChatInput>;
};

export type QueryFindCompaniesArgs = {
  fields?: InputMaybe<FindCompaniesInput>;
};

export type QueryFindCompanyArgs = {
  fields?: InputMaybe<FindCompanyInput>;
};

export type QueryFindCompanyFromSlugArgs = {
  fields?: InputMaybe<FindCompanyFromSlugInput>;
};

export type QueryFindConversationArgs = {
  fields?: InputMaybe<FindConversationInput>;
};

export type QueryFindConversationsArgs = {
  fields?: InputMaybe<FindConversationsInput>;
};

export type QueryFindEndorsementLinkArgs = {
  fields?: InputMaybe<FindEndorsementLinkInput>;
};

export type QueryFindEpicArgs = {
  fields?: InputMaybe<FindEpicInput>;
};

export type QueryFindGardenArgs = {
  fields?: InputMaybe<FindGardenInput>;
};

export type QueryFindGrantsArgs = {
  fields?: InputMaybe<FindGrantsInput>;
};

export type QueryFindLastNumMessagesChatExternalAppArgs = {
  fields?: InputMaybe<FindLastNumMessagesChatExternalAppInput>;
};

export type QueryFindMemberArgs = {
  fields?: InputMaybe<FindMemberInput>;
};

export type QueryFindMemberGraphArgs = {
  fields?: InputMaybe<FindMemberGraphInput>;
};

export type QueryFindMemberToMemberGraphArgs = {
  fields?: InputMaybe<FindMemberToMemberGraphInput>;
};

export type QueryFindMemberToProjectGraphArgs = {
  fields?: InputMaybe<FindMemberToProjectGraphInput>;
};

export type QueryFindMembersArgs = {
  fields?: InputMaybe<FindMembersInput>;
};

export type QueryFindMemoriesArgs = {
  fields?: InputMaybe<FindMemoriesInput>;
};

export type QueryFindMessageArgs = {
  fields?: InputMaybe<FindMessageInputPaginated>;
};

export type QueryFindMultipleMembersProjectsGraphArgs = {
  fields?: InputMaybe<FindMultipleMembersProjectsGraphInput>;
};

export type QueryFindNodeArgs = {
  fields?: InputMaybe<FindNodeInput>;
};

export type QueryFindNodesArgs = {
  fields?: InputMaybe<FindNodesInput>;
};

export type QueryFindOneMemberToMembersGraphArgs = {
  fields?: InputMaybe<FindOneMemberToMembersGraphInput>;
};

export type QueryFindPositionArgs = {
  fields?: InputMaybe<FindPositionInput>;
};

export type QueryFindPositionCandidateArgs = {
  fields?: InputMaybe<FindPositionCandidateInput>;
};

export type QueryFindPositionsArgs = {
  fields?: InputMaybe<FindPositionsInput>;
};

export type QueryFindPositionsOfCommunityArgs = {
  fields?: InputMaybe<FindPositionsOfCommunityInput>;
};

export type QueryFindPrioritiesTrainEdenAiArgs = {
  fields?: InputMaybe<FindPrioritiesTrainEdenAiInput>;
};

export type QueryFindProjectArgs = {
  fields?: InputMaybe<FindProjectInput>;
};

export type QueryFindProjectGraphArgs = {
  fields?: InputMaybe<FindProjectGraphInput>;
};

export type QueryFindProjectUpdatesArgs = {
  fields?: InputMaybe<FindProjectUpdatesInput>;
};

export type QueryFindProjectsArgs = {
  fields?: InputMaybe<FindProjectsInput>;
};

export type QueryFindProjects_RecommendedToUserArgs = {
  fields?: InputMaybe<FindProjects_RecommendedToUserInput>;
};

export type QueryFindProjects_RequireSkillArgs = {
  fields?: InputMaybe<FindProjects_RequireSkillInput>;
};

export type QueryFindQueryResponsesArgs = {
  fields?: InputMaybe<FindQueryResponsesInput>;
};

export type QueryFindQuestionEdenAiArgs = {
  fields?: InputMaybe<FindQuestionEdenAiInput>;
};

export type QueryFindRoleTemplateArgs = {
  fields?: InputMaybe<FindRoleTemplateInput>;
};

export type QueryFindRoleTemplatesArgs = {
  fields?: InputMaybe<FindRoleTemplatesInput>;
};

export type QueryFindRolesArgs = {
  fields?: InputMaybe<FindRolesInput>;
};

export type QueryFindRoomArgs = {
  fields?: InputMaybe<FindRoomsInput>;
};

export type QueryFindRoomsArgs = {
  fields?: InputMaybe<FindRoomsInput>;
};

export type QueryFindServersArgs = {
  fields?: InputMaybe<FindServersInput>;
};

export type QueryFindSkillArgs = {
  fields?: InputMaybe<FindSkillInput>;
};

export type QueryFindSkillCategoriesArgs = {
  fields?: InputMaybe<FindSkillCategoriesInput>;
};

export type QueryFindSkillCategoryArgs = {
  fields?: InputMaybe<FindSkillCategoryInput>;
};

export type QueryFindSkillSubCategoriesArgs = {
  fields?: InputMaybe<FindSkillSubCategoriesInput>;
};

export type QueryFindSkillSubCategoryArgs = {
  fields?: InputMaybe<FindSkillSubCategoryInput>;
};

export type QueryFindSkillsArgs = {
  fields?: InputMaybe<FindSkillsInput>;
};

export type QueryFindTeamsArgs = {
  fields?: InputMaybe<FindTeamsInput>;
};

export type QueryFindUserTalentListPositionArgs = {
  fields?: InputMaybe<FindUserTalentListPositionInput>;
};

export type QueryIdentifyCategoryAndReplyArgs = {
  fields?: InputMaybe<IdentifyCategoryAndReplyInput>;
};

export type QueryInterviewEdenAiArgs = {
  fields?: InputMaybe<InterviewEdenAiInput>;
};

export type QueryInterviewEdenGpt4onlyArgs = {
  fields?: InputMaybe<InterviewEdenGpt4onlyInput>;
};

export type QueryMatchMembersToProjectArgs = {
  fields?: InputMaybe<MatchMembersToProjectInput>;
};

export type QueryMatchMembersToProjectRoleArgs = {
  fields?: InputMaybe<MatchMembersToProjectRoleInput>;
};

export type QueryMatchMembersToSkillsArgs = {
  fields?: InputMaybe<MatchMembersToSkillInput>;
};

export type QueryMatchMembersToUserArgs = {
  fields?: InputMaybe<MatchMembersToUserInput>;
};

export type QueryMatchNodesToMembersArgs = {
  fields?: InputMaybe<MatchNodesToMembersInput>;
};

export type QueryMatchNodesToMembers_Ai4Args = {
  fields?: InputMaybe<MatchNodesToMembers_Ai4Input>;
};

export type QueryMatchNodesToMembers_OldArgs = {
  fields?: InputMaybe<MatchNodesToMembersInput>;
};

export type QueryMatchNodesToProjectRolesArgs = {
  fields?: InputMaybe<MatchNodesToProjectRolesInput>;
};

export type QueryMatchNodesToProjectRoles_OldArgs = {
  fields?: InputMaybe<MatchNodesToProjectRolesInput>;
};

export type QueryMatchPrepareNodeArgs = {
  fields?: InputMaybe<MatchPrepareNodeInput>;
};

export type QueryMatchPrepareNode_Ai4Args = {
  fields?: InputMaybe<MatchPrepareNode_Ai4Input>;
};

export type QueryMatchPrepareNode_OldArgs = {
  fields?: InputMaybe<MatchPrepareNodeInput>;
};

export type QueryMatchPrepareSkillToMembersArgs = {
  fields?: InputMaybe<MatchPrepareSkillToMembersInput>;
};

export type QueryMatchPrepareSkillToProjectRolesArgs = {
  fields?: InputMaybe<MatchPrepareSkillToProjectRolesInput>;
};

export type QueryMatchProjectsToMemberArgs = {
  fields?: InputMaybe<MatchProjectsToMemberInput>;
};

export type QueryMatchSkillsToMembersArgs = {
  fields?: InputMaybe<MatchSkillsToMembersInput>;
};

export type QueryMatchSkillsToProjectsArgs = {
  fields?: InputMaybe<MatchSkillsToProjectsInput>;
};

export type QueryMatch_ProjectToUserArgs = {
  fields?: InputMaybe<Match_ProjectToUserInput>;
};

export type QueryMemberPieChartNodeCategoriesArgs = {
  fields?: InputMaybe<MemberPieChartNodeCategoriesInput>;
};

export type QueryMemberRadioChartCharacterAttributesArgs = {
  fields?: InputMaybe<MemberRadioChartCharacterAttributesInput>;
};

export type QueryMembersStatsArgs = {
  fields?: InputMaybe<StatsInput>;
};

export type QueryMembers_AutocompleteArgs = {
  fields?: InputMaybe<Members_AutocompleteInput>;
};

export type QueryMessageMapKgArgs = {
  fields?: InputMaybe<MessageMapKgInput>;
};

export type QueryMessageMapKg_V2Args = {
  fields?: InputMaybe<MessageMapKg_V2Input>;
};

export type QueryMessageMapKg_V3Args = {
  fields?: InputMaybe<MessageMapKg_V3Input>;
};

export type QueryMessageMapKg_V4Args = {
  fields?: InputMaybe<MessageMapKg_V4Input>;
};

export type QueryMessageMapKg_V5Args = {
  fields?: InputMaybe<MessageMapKg_V5Input>;
};

export type QueryNodes_AutocompleteArgs = {
  fields?: InputMaybe<Nodes_AutocompleteInput>;
};

export type QuerySearchEden_V1Args = {
  fields?: InputMaybe<SearchEden_V1Input>;
};

export type QuerySendEmailViaSendGridArgs = {
  fields?: InputMaybe<EmailInput>;
};

export type QuerySendWhatsAppMessageArgs = {
  fields?: InputMaybe<WhatsAppInput>;
};

export type QuerySetAllMatch_V2Args = {
  node?: InputMaybe<Scalars["String"]>;
  val?: InputMaybe<Scalars["Boolean"]>;
};

export type QuerySkillsArgs = {
  fields?: InputMaybe<FindSkillsInputPaginated>;
};

export type QuerySkills_AutocompleteArgs = {
  fields?: InputMaybe<Skills_AutocompleteInput>;
};

export type QueryTreeOfRelatedNodesArgs = {
  fields?: InputMaybe<TreeOfRelatedNodesInput>;
};

export type QueryWaitingToAproveSkillsArgs = {
  fields?: InputMaybe<FindSkillsInput>;
};

export type QueryResponse = {
  __typename?: "QueryResponse";
  _id?: Maybe<Scalars["ID"]>;
  answer?: Maybe<AnswerType>;
  category?: Maybe<CategoryQueryResponseEnum>;
  conversation?: Maybe<Conversation>;
  phase?: Maybe<PhaseQueryResponseEnum>;
  question?: Maybe<QuestionQueryType>;
  responder?: Maybe<ResponderType>;
  sender?: Maybe<SenderType>;
  sentFlag?: Maybe<Scalars["Boolean"]>;
};

export type QuestionContentType = {
  __typename?: "QuestionContentType";
  content?: Maybe<Scalars["String"]>;
  question?: Maybe<Scalars["String"]>;
};

export type QuestionType = {
  __typename?: "QuestionType";
  bestAnswer?: Maybe<Scalars["String"]>;
  category?: Maybe<Scalars["String"]>;
  question?: Maybe<QuestionsEdenAi>;
};

export type QuestionTypeInput = {
  bestAnswer?: InputMaybe<Scalars["String"]>;
  category?: InputMaybe<Scalars["String"]>;
  questionContent?: InputMaybe<Scalars["String"]>;
  questionID?: InputMaybe<Scalars["ID"]>;
};

export type QuestionsEdenAi = {
  __typename?: "QuestionsEdenAI";
  _id?: Maybe<Scalars["ID"]>;
  answeredQuestionByUsers?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  category?: Maybe<Scalars["String"]>;
  content?: Maybe<Scalars["String"]>;
  contentSmall?: Maybe<Scalars["String"]>;
  questionOwnedByPositions?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type ResultCount = {
  __typename?: "ResultCount";
  count?: Maybe<Scalars["Int"]>;
  date?: Maybe<DateType>;
};

export type ResultCount2 = {
  __typename?: "ResultCount2";
  count?: Maybe<Scalars["Int"]>;
  date?: Maybe<Scalars["String"]>;
};

export type Review = {
  __typename?: "Review";
  _id?: Maybe<Scalars["ID"]>;
  arweaveTransactionID?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["Date"]>;
  discussion?: Maybe<Array<Maybe<DiscussionMessage>>>;
  income?: Maybe<Scalars["Float"]>;
  nodes?: Maybe<Array<Maybe<ReviewNode>>>;
  reviewMessage?: Maybe<Scalars["String"]>;
  stars?: Maybe<Scalars["Int"]>;
  userReceive?: Maybe<Members>;
  userSend?: Maybe<Members>;
};

export type Role = {
  __typename?: "Role";
  _id?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
  members?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  project?: Maybe<Project>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  teams?: Maybe<Array<Maybe<Team>>>;
};

export type RoleTemplate = {
  __typename?: "RoleTemplate";
  _id?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Maybe<Skills>>>;
  title?: Maybe<Scalars["String"]>;
};

export type RoleType_Garden = {
  __typename?: "RoleType_garden";
  announcement?: Maybe<Array<Maybe<ProjectUpdate>>>;
  roleData?: Maybe<Role>;
};

export type Rooms = {
  __typename?: "Rooms";
  _id?: Maybe<Scalars["ID"]>;
  avatar?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  hosts?: Maybe<Array<Maybe<Members>>>;
  members?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  registeredAt?: Maybe<Scalars["String"]>;
  serverID?: Maybe<Scalars["String"]>;
};

export type ServerTemplate = {
  __typename?: "ServerTemplate";
  _id?: Maybe<Scalars["ID"]>;
  adminCommands?: Maybe<Array<Maybe<Scalars["String"]>>>;
  adminID?: Maybe<Array<Maybe<Scalars["String"]>>>;
  adminRoles?: Maybe<Array<Maybe<Scalars["String"]>>>;
  channel?: Maybe<ChannelOutput>;
  name?: Maybe<Scalars["String"]>;
  serverAvatar?: Maybe<Scalars["String"]>;
  serverType?: Maybe<Scalars["String"]>;
};

export type ShowMembersConnectedToNodesOutput = {
  __typename?: "ShowMembersConnectedToNodesOutput";
  member?: Maybe<Members>;
  primitiveCardMemInput?: Maybe<Array<Maybe<PrimitiveCardType>>>;
  rank?: Maybe<Scalars["Int"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type SkillCategory = {
  __typename?: "SkillCategory";
  _id?: Maybe<Scalars["ID"]>;
  description?: Maybe<Scalars["String"]>;
  emoji?: Maybe<Scalars["String"]>;
  id_lightcast?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Maybe<Skills>>>;
  subCategorySkill?: Maybe<Array<Maybe<SkillSubCategory>>>;
};

export type SkillSubCategory = {
  __typename?: "SkillSubCategory";
  _id?: Maybe<Scalars["ID"]>;
  categorySkills?: Maybe<Array<Maybe<SkillCategory>>>;
  description?: Maybe<Scalars["String"]>;
  emoji?: Maybe<Scalars["String"]>;
  id_lightcast?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Maybe<Skills>>>;
};

export type Skills = {
  __typename?: "Skills";
  _id?: Maybe<Scalars["ID"]>;
  authors?: Maybe<Array<Maybe<Members>>>;
  categorySkills?: Maybe<Array<Maybe<SkillCategory>>>;
  id_lightcast?: Maybe<Scalars["String"]>;
  match?: Maybe<MatchType>;
  members?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  registeredAt?: Maybe<Scalars["String"]>;
  relatedSkills?: Maybe<Array<Maybe<Skills>>>;
  state?: Maybe<ApprovedSkillEnum>;
  subCategorySkill?: Maybe<Array<Maybe<SkillSubCategory>>>;
  tweets?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type SkillsPercentage = {
  __typename?: "SkillsPercentage";
  info?: Maybe<Skills>;
  percentage100?: Maybe<Scalars["Float"]>;
  percentageReal?: Maybe<Scalars["Float"]>;
};

export type SortByMessage = {
  direction?: InputMaybe<SortDirection>;
  field?: InputMaybe<SortableMessageFields>;
};

export type SortBySkill = {
  direction?: InputMaybe<SortDirection>;
  field?: InputMaybe<SortableSkillFields>;
};

export enum SortDirection {
  Asc = "ASC",
  Desc = "DESC",
}

export enum SortableMessageFields {
  Id = "_id",
  CreatedAt = "createdAt",
}

export enum SortableSkillFields {
  Id = "_id",
  Name = "name",
  RegisteredAt = "registeredAt",
}

export type StripeProductType = {
  __typename?: "StripeProductType";
  ID?: Maybe<Scalars["String"]>;
};

export type StripeSessionType = {
  __typename?: "StripeSessionType";
  ID?: Maybe<Scalars["String"]>;
};

export type StripeType = {
  __typename?: "StripeType";
  customerID?: Maybe<Scalars["String"]>;
  product?: Maybe<StripeProductType>;
  session?: Maybe<StripeSessionType>;
};

export type StyleEdgeOut = {
  __typename?: "StyleEdgeOut";
  distance?: Maybe<Scalars["Float"]>;
  fill?: Maybe<Scalars["String"]>;
  strength?: Maybe<Scalars["Float"]>;
  stroke?: Maybe<Scalars["String"]>;
};

export type StyleIn = {
  fill?: InputMaybe<Scalars["String"]>;
  size?: InputMaybe<Scalars["Int"]>;
  stroke?: InputMaybe<Scalars["String"]>;
};

export type StyleNodeOut = {
  __typename?: "StyleNodeOut";
  fill?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
  stroke?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  conversationUpdated?: Maybe<ConversationType>;
  memberDataConnectedTG?: Maybe<Members>;
  memberUpdated?: Maybe<Members>;
  memberUpdatedInRoom?: Maybe<Members>;
  positionDataConnectedTG?: Maybe<Position>;
  queryResponseUpdated?: Maybe<QueryResponse>;
  roomUpdated?: Maybe<Rooms>;
  userCVSavedToDB?: Maybe<AddCvToUserOutput>;
};

export type SubscriptionConversationUpdatedArgs = {
  fields?: InputMaybe<ConversationUpdatedInput>;
};

export type SubscriptionMemberDataConnectedTgArgs = {
  fields?: InputMaybe<MemberDataConnectedTgInput>;
};

export type SubscriptionMemberUpdatedArgs = {
  fields?: InputMaybe<FindMembersInput>;
};

export type SubscriptionMemberUpdatedInRoomArgs = {
  fields?: InputMaybe<FindRoomsInput>;
};

export type SubscriptionPositionDataConnectedTgArgs = {
  fields?: InputMaybe<PositionDataConnectedTgInput>;
};

export type SubscriptionQueryResponseUpdatedArgs = {
  fields?: InputMaybe<FindRoomsInput>;
};

export type SubscriptionRoomUpdatedArgs = {
  fields?: InputMaybe<FindRoomsInput>;
};

export type SummaryQuestionType = {
  __typename?: "SummaryQuestionType";
  answerContent?: Maybe<Scalars["String"]>;
  answerContentSmall?: Maybe<Scalars["String"]>;
  bestAnswerPosition?: Maybe<Scalars["String"]>;
  originalQuestionContent?: Maybe<Scalars["String"]>;
  questionContent?: Maybe<Scalars["String"]>;
  questionContentSmall?: Maybe<Scalars["String"]>;
  questionID?: Maybe<Scalars["ID"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
  subConversationAnswer?: Maybe<Array<Maybe<ConversationType>>>;
};

export type Team = {
  __typename?: "Team";
  _id?: Maybe<Scalars["ID"]>;
  categoryDiscordlD?: Maybe<Scalars["String"]>;
  champion?: Maybe<Array<Maybe<Members>>>;
  channelGeneralDiscordID?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  epics?: Maybe<Array<Maybe<Epic>>>;
  forumDiscordID?: Maybe<Scalars["String"]>;
  members?: Maybe<Array<Maybe<Members>>>;
  name?: Maybe<Scalars["String"]>;
  projects?: Maybe<Project>;
  roles?: Maybe<Array<Maybe<Role>>>;
  serverID?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type TextToPrimitivesAndTalentOutput = {
  __typename?: "TextToPrimitivesAndTalentOutput";
  member?: Maybe<Members>;
  primitiveCardMemInput?: Maybe<Array<Maybe<PrimitiveCardType>>>;
  rank?: Maybe<Scalars["Int"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type User = {
  __typename?: "User";
  _id: Scalars["ID"];
  email?: Maybe<Scalars["String"]>;
  isPasswordRandom?: Maybe<Scalars["Boolean"]>;
  lastname?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  number?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  registeredAt?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
};

export enum ActionTypeEnum {
  MessageUser = "messageUser",
  SearchProfile = "searchProfile",
}

export type ActiveUsersInput = {
  endDate?: InputMaybe<Scalars["Date"]>;
  range?: InputMaybe<Range2>;
  startDate?: InputMaybe<Scalars["Date"]>;
};

export type AddCandidatesPositionInput = {
  candidates?: InputMaybe<Array<InputMaybe<CandidatesInput>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type AddCardMemoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  authorCard?: InputMaybe<AuthorCardMemoryInput>;
  connectedCards?: InputMaybe<Array<InputMaybe<ConnectedCardsInput>>>;
  content?: InputMaybe<Scalars["String"]>;
  priority?: InputMaybe<Scalars["Int"]>;
  score?: InputMaybe<ScoreCardMemoryInput>;
  tradeOffBoost?: InputMaybe<Scalars["Int"]>;
  type?: InputMaybe<TypeCardMemoryEnum>;
};

export type AddChatExternalAppInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  chatID_TG?: InputMaybe<Scalars["ID"]>;
  communicationAuthorType?: InputMaybe<CommunicationAuthorTypeEnum>;
  message?: InputMaybe<Scalars["String"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  senderRole?: InputMaybe<SenderRoleEnum>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type AddConvRecruiterToPositionInput = {
  conversationID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type AddEmployeesCompanyInput = {
  companyID?: InputMaybe<Scalars["ID"]>;
  employees?: InputMaybe<Array<InputMaybe<EmployeeTypeInput>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
  slug?: InputMaybe<Scalars["String"]>;
};

export type AddEndorsementInput = {
  discussion?: InputMaybe<Array<InputMaybe<DiscussionMessageInput>>>;
  endorseNodes?: InputMaybe<Array<InputMaybe<EndorseNodeInput>>>;
  endorsementMessage?: InputMaybe<Scalars["String"]>;
  stake?: InputMaybe<Scalars["Float"]>;
  stars?: InputMaybe<Scalars["Int"]>;
  userReceiveID?: InputMaybe<Scalars["ID"]>;
  userSendID?: InputMaybe<Scalars["ID"]>;
};

export type AddFavoriteProjectInput = {
  favorite?: InputMaybe<Scalars["Boolean"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
};

export type AddMemoryInput = {
  _id?: InputMaybe<Scalars["String"]>;
  convKey?: InputMaybe<Scalars["String"]>;
  environment?: InputMaybe<Scalars["String"]>;
  label?: InputMaybe<Scalars["String"]>;
  memory?: InputMaybe<Scalars["String"]>;
  pineconeID?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type AddMessageInput = {
  creator?: InputMaybe<Scalars["ID"]>;
  mentioned?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  message?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Scalars["String"]>;
};

export type AddMessagesInput = {
  data?: InputMaybe<Array<InputMaybe<AddMessageInput>>>;
};

export type AddNewChatInput = {
  message: Scalars["String"];
  projectID: Scalars["ID"];
  projectRoleID?: InputMaybe<Scalars["ID"]>;
  receiverID: Scalars["ID"];
  serverID: Scalars["ID"];
  threadID: Scalars["ID"];
};

export type AddNewMemberInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  bio?: InputMaybe<Scalars["String"]>;
  discordAvatar?: InputMaybe<Scalars["String"]>;
  discordName?: InputMaybe<Scalars["String"]>;
  discriminator?: InputMaybe<Scalars["String"]>;
  hoursPerWeek?: InputMaybe<Scalars["Float"]>;
  invitedBy?: InputMaybe<Scalars["String"]>;
  previousProjects?: InputMaybe<Array<InputMaybe<PreviousProjectsInput>>>;
  serverID?: InputMaybe<Scalars["String"]>;
};

export type AddNodeType = {
  nodeID?: InputMaybe<Scalars["ID"]>;
};

export type AddNodesToGrantInput = {
  grantID?: InputMaybe<Scalars["ID"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type AddNodesToMemberInRoomInput = {
  RoomID?: InputMaybe<Scalars["ID"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type AddNodesToMemberInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  nodesID_level?: InputMaybe<Array<InputMaybe<NodesId_LevelInput>>>;
};

export type AddNodesToPositionInput = {
  nodes?: InputMaybe<Array<InputMaybe<AddNodeType>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type AddNodesToProjectRoleInput = {
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectRoleID?: InputMaybe<Scalars["ID"]>;
};

export type AddPreferencesToMemberInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  preferences?: InputMaybe<Array<InputMaybe<PreferencesInput>>>;
};

export type AddProjectRoleInput = {
  description?: InputMaybe<Scalars["String"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type AddQuestionToEdenAiInput = {
  content?: InputMaybe<Scalars["String"]>;
};

export type AddQuestionToEdenAiOutput = {
  __typename?: "addQuestionToEdenAIOutput";
  _id?: Maybe<Scalars["ID"]>;
  content?: Maybe<Scalars["String"]>;
};

export type AddQuestionsToAskPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  questionsToAsk?: InputMaybe<Array<InputMaybe<QuestionTypeInput>>>;
};

export type AddReviewInput = {
  discussion?: InputMaybe<Array<InputMaybe<DiscussionMessageInput>>>;
  income?: InputMaybe<Scalars["Float"]>;
  payEndorsers?: InputMaybe<Scalars["Boolean"]>;
  reviewMessage?: InputMaybe<Scalars["String"]>;
  reviewNodes?: InputMaybe<Array<InputMaybe<EndorseNodeInput>>>;
  stars?: InputMaybe<Scalars["Int"]>;
  userReceiveID?: InputMaybe<Scalars["ID"]>;
  userSendID?: InputMaybe<Scalars["ID"]>;
};

export type AddSkillToMember_Input = {
  authorID?: InputMaybe<Scalars["ID"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillID?: InputMaybe<Scalars["ID"]>;
};

export type AgentScoreCard = {
  __typename?: "agentScoreCard";
  category?: Maybe<CategoryAgentScoreCardEnum>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type AgentScoreCardInput = {
  category?: InputMaybe<CategoryAgentScoreCardEnum>;
  reason?: InputMaybe<Scalars["String"]>;
  score?: InputMaybe<Scalars["Float"]>;
};

export type AnalysisCandidateEdenAiType = {
  __typename?: "analysisCandidateEdenAIType";
  background?: Maybe<BackgroundAnalysisType>;
  fitRequirements?: Maybe<FitRequirementsAnalysisType>;
  flagAnalysisCreated?: Maybe<Scalars["Boolean"]>;
  skills?: Maybe<SkillsAnalysisType>;
};

export type AnswerType = {
  __typename?: "answerType";
  content?: Maybe<Scalars["String"]>;
};

export type ApplyGrantInput = {
  grantID?: InputMaybe<Scalars["ID"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type ApproveOrRejectSkillInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  categorySkills?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  state?: InputMaybe<ApprovedSkillEnum>;
  subCategorySkill?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type ApproveTweetInput = {
  approved?: InputMaybe<Scalars["Boolean"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  tweetID?: InputMaybe<Scalars["ID"]>;
};

export enum ApprovedSkillEnum {
  Approved = "approved",
  Rejected = "rejected",
  Waiting = "waiting",
}

export type AskEdenUserPositionGptFuncInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  memoriesType?: InputMaybe<MemoriesTypeEnum>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
  whatToAsk?: InputMaybe<WhatToAskEnum>;
};

export type AskEdenUserPositionGptFuncOutput = {
  __typename?: "askEdenUserPositionGPTFuncOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type AskEdenUserPositionGptFunc_V2Input = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  conversationID?: InputMaybe<Scalars["ID"]>;
  memoriesType?: InputMaybe<MemoriesTypeEnum>;
  newMessage?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
  whatToAsk?: InputMaybe<WhatToAskEnum>;
};

export type AskEdenUserPositionGptFunc_V2Output = {
  __typename?: "askEdenUserPositionGPTFunc_V2Output";
  cardMemoriesUsed?: Maybe<Array<Maybe<CardMemoriesUsedType>>>;
  reply?: Maybe<Scalars["String"]>;
};

export type AskEdenUserPositionInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
  whatToAsk?: InputMaybe<WhatToAskEnum>;
};

export type AskEdenUserPositionOutput = {
  __typename?: "askEdenUserPositionOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type AttributeCandidateType = {
  __typename?: "attributeCandidateType";
  attribute?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Int"]>;
};

export type AttributeType = {
  __typename?: "attributeType";
  attribute?: Maybe<Scalars["String"]>;
};

export enum AttributesEnum {
  Coordinator = "Coordinator",
  Director = "Director",
  Helper = "Helper",
  Inspirer = "Inspirer",
  Motivator = "Motivator",
  Observer = "Observer",
  Reformer = "Reformer",
  Supporter = "Supporter",
}

export type AttributesType = {
  __typename?: "attributesType";
  Coordinator?: Maybe<Scalars["Int"]>;
  Director?: Maybe<Scalars["Int"]>;
  Helper?: Maybe<Scalars["Int"]>;
  Inspirer?: Maybe<Scalars["Int"]>;
  Motivator?: Maybe<Scalars["Int"]>;
  Observer?: Maybe<Scalars["Int"]>;
  Reformer?: Maybe<Scalars["Int"]>;
  Supporter?: Maybe<Scalars["Int"]>;
};

export type AuthorCardMemory = {
  __typename?: "authorCardMemory";
  category?: Maybe<CategoryCardMemoryEnum>;
  companyID?: Maybe<Scalars["ID"]>;
  positionID?: Maybe<Scalars["ID"]>;
  userID?: Maybe<Scalars["ID"]>;
};

export type AuthorCardMemoryInput = {
  category?: InputMaybe<CategoryCardMemoryEnum>;
  companyID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type AutoCalculatePrioritiesAndQuestionsInput = {
  nothing?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type AutoCreateCardsCandidatesAndScoreInput = {
  nothing?: InputMaybe<Scalars["String"]>;
};

export type AutoCreateCardsForPositionInput = {
  nothing?: InputMaybe<Scalars["String"]>;
};

export type AutoUpdateMemoryFromCvInput = {
  userIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type AutoUpdateMemoryFromCvOutput = {
  __typename?: "autoUpdateMemoryFromCVOutput";
  users?: Maybe<Array<Maybe<Members>>>;
};

export type AutoUpdateMemoryFromPositionRequirmentsInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type AutoUpdateMemoryFromPositionRequirmentsOutput = {
  __typename?: "autoUpdateMemoryFromPositionRequirmentsOutput";
  positions?: Maybe<Array<Maybe<Position>>>;
};

export type AutoUpdatePositionCompInformationInput = {
  mustUpdate?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type AutoUpdateUserInfoFromCvInput = {
  userIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type AutoUpdateUserInfoFromCvOutput = {
  __typename?: "autoUpdateUserInfoFromCVOutput";
  users?: Maybe<Array<Maybe<Members>>>;
};

export type AvailabilityInput = {
  maxHourPerWeek?: InputMaybe<Scalars["Int"]>;
  minHourPerWeek?: InputMaybe<Scalars["Int"]>;
};

export type BackgroundAnalysisType = {
  __typename?: "backgroundAnalysisType";
  content?: Maybe<Scalars["String"]>;
  oneLiner?: Maybe<Scalars["String"]>;
  smallVersion?: Maybe<Scalars["String"]>;
};

export type BatchCardsInput = {
  cardMemoryID?: InputMaybe<Scalars["ID"]>;
  content?: InputMaybe<Scalars["String"]>;
  priority?: InputMaybe<Scalars["Int"]>;
  scoreCriteria?: InputMaybe<Scalars["String"]>;
  tradeOffBoost?: InputMaybe<Scalars["Int"]>;
  type?: InputMaybe<TypeCardMemoryEnum>;
};

export type BudgetInput = {
  perHour?: InputMaybe<Scalars["String"]>;
  perMonth?: InputMaybe<Scalars["String"]>;
  token?: InputMaybe<Scalars["String"]>;
  totalBudget?: InputMaybe<Scalars["String"]>;
};

export type BudgetInputT = {
  maxPerHour?: InputMaybe<Scalars["Float"]>;
  minPerHour?: InputMaybe<Scalars["Float"]>;
};

export type BudgetInputTk = {
  perHour?: InputMaybe<Scalars["Float"]>;
  perMonth?: InputMaybe<Scalars["Float"]>;
  token?: InputMaybe<Scalars["String"]>;
  totalBudget?: InputMaybe<Scalars["Float"]>;
};

export type BudgetMemberType = {
  __typename?: "budgetMemberType";
  perHour?: Maybe<Scalars["Float"]>;
  perMonth?: Maybe<Scalars["Float"]>;
  token?: Maybe<Scalars["String"]>;
  totalBudget?: Maybe<Scalars["Float"]>;
};

export type BudgetType = {
  __typename?: "budgetType";
  perHour?: Maybe<Scalars["String"]>;
  perMonth?: Maybe<Scalars["String"]>;
  token?: Maybe<Scalars["String"]>;
  totalBudget?: Maybe<Scalars["String"]>;
};

export type CalculateReputationInput = {
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CalculateScoreCardCandidateToPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CandidateNotesComparePositionEdenAiInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type CandidateNotesComparePositionEdenAiOutput = {
  __typename?: "candidateNotesComparePositionEdenAIOutput";
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Array<Maybe<Scalars["String"]>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type CandidateNotesEdenAiInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type CandidateNotesEdenAiOutput = {
  __typename?: "candidateNotesEdenAIOutput";
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Array<Maybe<Scalars["String"]>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type CandidatesInput = {
  acceptedOrRejected?: InputMaybe<Scalars["Boolean"]>;
  conversationID?: InputMaybe<Scalars["ID"]>;
  overallScore?: InputMaybe<Scalars["Float"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CardMemoriesFromInputType = {
  __typename?: "cardMemoriesFromInputType";
  cardMemory?: Maybe<CardMemory>;
  cardMemoryMember?: Maybe<Array<Maybe<CardMemoryMemberType>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type CardMemoriesStructureInput = {
  cardMemoryID?: InputMaybe<Scalars["ID"]>;
  importance?: InputMaybe<Scalars["Int"]>;
  primitives?: InputMaybe<Array<InputMaybe<PrimitiveCardMemInput>>>;
};

export enum CategoryAgentScoreCardEnum {
  Alignment = "ALIGNMENT",
  Consistency = "CONSISTENCY",
  Credibility = "CREDIBILITY",
  Expert = "EXPERT",
  General = "GENERAL",
}

export enum CategoryCardMemoryEnum {
  Candidate = "CANDIDATE",
  Company = "COMPANY",
  Position = "POSITION",
}

export enum CategoryMessageCategoryEnum {
  AcceptCandidate = "ACCEPT_CANDIDATE",
  AskAboutPositionAlreadyApplied = "ASK_ABOUT_POSITION_ALREADY_APPLIED",
  AskCandidate = "ASK_CANDIDATE",
  AskFindNewPosition = "ASK_FIND_NEW_POSITION",
  GeneralConversation = "GENERAL_CONVERSATION",
  GiveMoreInfoAboutBackground = "GIVE_MORE_INFO_ABOUT_BACKGROUND",
  PitchPositionCandidate = "PITCH_POSITION_CANDIDATE",
  RejectCandidate = "REJECT_CANDIDATE",
}

export enum CategoryQueryResponseEnum {
  AcceptCandidate = "ACCEPT_CANDIDATE",
  AskCandidate = "ASK_CANDIDATE",
  PitchPositionCandidate = "PITCH_POSITION_CANDIDATE",
  RejectCandidate = "REJECT_CANDIDATE",
}

export type ChangeTeamMember_Phase_ProjectInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  phase?: InputMaybe<PhaseType>;
  projectID?: InputMaybe<Scalars["ID"]>;
  roleID?: InputMaybe<Scalars["ID"]>;
};

export type ChannelOutput = {
  __typename?: "channelOutput";
  chatID?: Maybe<Scalars["ID"]>;
  forumID?: Maybe<Scalars["ID"]>;
};

export type ChatRespType = {
  __typename?: "chatRespType";
  content?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  role?: Maybe<RoleEnum>;
  typeWidget?: Maybe<WidgetTypeEnum>;
  widgetVars?: Maybe<WidgetVarsType>;
};

export type ChatResponse = {
  __typename?: "chatResponse";
  numChat?: Maybe<Scalars["Int"]>;
  numReply?: Maybe<Scalars["Int"]>;
};

export type CheckLimitMessagesExternalAppInput = {
  chatID_TG?: InputMaybe<Scalars["ID"]>;
  communicationAuthorType?: InputMaybe<CommunicationAuthorTypeEnum>;
  limitDay?: InputMaybe<Scalars["Int"]>;
  limitHour?: InputMaybe<Scalars["Int"]>;
  limitMinute?: InputMaybe<Scalars["Int"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CheckLimitMessagesExternalAppOutput = {
  __typename?: "checkLimitMessagesExternalAppOutput";
  limitExceeded?: Maybe<Scalars["Boolean"]>;
  limitExceededDay?: Maybe<Scalars["Boolean"]>;
  limitExceededHour?: Maybe<Scalars["Boolean"]>;
  limitExceededMinute?: Maybe<Scalars["Boolean"]>;
  message?: Maybe<Scalars["String"]>;
};

export type CheckUsersForTgConnectionInput = {
  authNumberTGMessage?: InputMaybe<Scalars["String"]>;
  telegramChatID?: InputMaybe<Scalars["String"]>;
  telegramID?: InputMaybe<Scalars["String"]>;
};

export type CollaborationLinksInput = {
  link?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type CollaborationLinksType = {
  __typename?: "collaborationLinksType";
  link?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export enum CommunicationAuthorTypeEnum {
  Position = "POSITION",
  User = "USER",
}

export type CommunitySubscribersType = {
  __typename?: "communitySubscribersType";
  companyID?: Maybe<Scalars["ID"]>;
  positionID?: Maybe<Scalars["ID"]>;
};

export type CompanyType = {
  __typename?: "companyType";
  company?: Maybe<Company>;
  typeT?: Maybe<EmployeeRole>;
};

export type CompareCandidatePositionType = {
  __typename?: "compareCandidatePositionType";
  CVToPosition?: Maybe<CvToPositionType>;
  CV_ConvoToPosition?: Maybe<Array<Maybe<NotesInterviewType>>>;
  CV_ConvoToPositionAverageScore?: Maybe<Scalars["Float"]>;
  reportPassFail?: Maybe<Array<Maybe<ReportPassFailType2>>>;
};

export type ConductInput = {
  email?: InputMaybe<Scalars["String"]>;
  number?: InputMaybe<Scalars["String"]>;
  telegram?: InputMaybe<Scalars["String"]>;
  whatsappNumber?: InputMaybe<Scalars["String"]>;
};

export type ConductType = {
  __typename?: "conductType";
  email?: Maybe<Scalars["String"]>;
  number?: Maybe<Scalars["String"]>;
  telegram?: Maybe<Scalars["String"]>;
  telegramChatID?: Maybe<Scalars["String"]>;
  telegramConnectionCode?: Maybe<Scalars["String"]>;
  whatsappNumber?: Maybe<Scalars["String"]>;
};

export type Conn_Node_WhType = {
  __typename?: "conn_node_whType";
  nodeConnID?: Maybe<Scalars["String"]>;
  numPath?: Maybe<Scalars["Float"]>;
  wh_sum?: Maybe<Scalars["Float"]>;
};

export enum ConnectCardTypeEnum {
  FilterUser = "filterUser",
}

export type ConnectMemoriesToKnowledgeGraph_V2Input = {
  createKGconnections?: InputMaybe<Scalars["Boolean"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  runAuto?: InputMaybe<RunAutoEnum>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type ConnectNeighborNodesKgInput = {
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type ConnectedCards = {
  __typename?: "connectedCards";
  agent?: Maybe<Array<Maybe<AgentScoreCard>>>;
  card?: Maybe<CardMemory>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type ConnectedCardsInput = {
  agent?: InputMaybe<Array<InputMaybe<AgentScoreCardInput>>>;
  cardID?: InputMaybe<Scalars["ID"]>;
  reason?: InputMaybe<Scalars["String"]>;
  score?: InputMaybe<Scalars["Float"]>;
};

export type ContentInput = {
  interest?: InputMaybe<Scalars["String"]>;
  mostProud?: InputMaybe<Scalars["String"]>;
  showCaseAbility?: InputMaybe<Scalars["String"]>;
};

export type ContentType = {
  __typename?: "contentType";
  interest?: Maybe<Scalars["String"]>;
  mostProud?: Maybe<Scalars["String"]>;
  showCaseAbility?: Maybe<Scalars["String"]>;
};

export type ConvMemoryType = {
  __typename?: "convMemoryType";
  memoryContent?: Maybe<Scalars["String"]>;
  pineConeID?: Maybe<Scalars["String"]>;
};

export type ConvRecruiterType = {
  __typename?: "convRecruiterType";
  convMemory?: Maybe<Array<Maybe<ConvMemoryType>>>;
  conversation?: Maybe<Array<Maybe<ConversationType>>>;
  positionQuestions?: Maybe<Array<Maybe<QuestionContentType>>>;
  readyToDisplay?: Maybe<Scalars["Boolean"]>;
  roleQuestions?: Maybe<Array<Maybe<QuestionContentType>>>;
  user?: Maybe<Members>;
};

export type ConversationCvPositionToReportInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type ConversationCvPositionToReportOutput = {
  __typename?: "conversationCVPositionToReportOutput";
  CV_ConvoToPosition?: Maybe<Array<Maybe<NotesInterviewType2>>>;
  CV_ConvoToPositionAverageScore?: Maybe<Scalars["Float"]>;
  report?: Maybe<Scalars["String"]>;
  reportPassFail?: Maybe<Array<Maybe<ReportPassFailType>>>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type ConversationInfoInput = {
  conversationID?: InputMaybe<Scalars["ID"]>;
};

export type ConversationInput = {
  content?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Scalars["String"]>;
};

export type ConversationToSummaryGptInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type ConversationToSummaryGptOutput = {
  __typename?: "conversationToSummaryGPTOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type ConversationType = {
  __typename?: "conversationType";
  content?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  role?: Maybe<Scalars["String"]>;
  typeWidget?: Maybe<WidgetTypeEnum>;
  widgetVars?: Maybe<WidgetVarsType>;
};

export type ConversationUpdatedInput = {
  conversationID?: InputMaybe<Scalars["ID"]>;
};

export type CreateApprovedSkillInput = {
  name?: InputMaybe<Scalars["String"]>;
};

export type CreateCardsCandidateForPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CreateCardsForPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type CreateCoreMemoriesInput = {
  coreMemories?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CreateCoreMemoriesOutput = {
  __typename?: "createCoreMemoriesOutput";
  output?: Maybe<Scalars["String"]>;
};

export type CreateEndorsementLinkInput = {
  message?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type CreateErrorInput = {
  code?: InputMaybe<Scalars["String"]>;
  component?: InputMaybe<Scalars["String"]>;
  errorType?: InputMaybe<ErrorTypeEnum>;
  memberID?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  path?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  stacktrace?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  url?: InputMaybe<Scalars["String"]>;
};

export type CreateFakeEndorsementInput = {
  userReceiveID?: InputMaybe<Scalars["ID"]>;
  userSendID?: InputMaybe<Scalars["ID"]>;
};

export type CreateFakeReviewInput = {
  payEndorsers?: InputMaybe<Scalars["Boolean"]>;
  userReceiveID?: InputMaybe<Scalars["ID"]>;
  userSendID?: InputMaybe<Scalars["ID"]>;
};

export type CreateFakeUserCVnewInput = {
  cvContent?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type CreateFakeUserInput = {
  expertise?: InputMaybe<Array<InputMaybe<NodeCategoryInput>>>;
  interests?: InputMaybe<Array<InputMaybe<NodeCategoryInput>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type CreateMultipleFakeEndorsementAndReviewInput = {
  numEnrosements?: InputMaybe<Scalars["Int"]>;
  numReviews?: InputMaybe<Scalars["Int"]>;
  numUserEndorse?: InputMaybe<Scalars["Int"]>;
  numUserReview?: InputMaybe<Scalars["Int"]>;
};

export type CreateNewEpicInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  authorID?: InputMaybe<Scalars["String"]>;
  championID?: InputMaybe<Scalars["String"]>;
  channelDiscordlID?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  notifyUserID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phase?: InputMaybe<PhaseEpicType>;
  projectID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type CreateNewRoleInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type CreateNewTeamInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  categoryDiscordlD?: InputMaybe<Scalars["String"]>;
  championID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  channelGeneralDiscordID?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  forumDiscordID?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  projectID?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type CreateNodeCategoryGroupInput = {
  categoryID?: InputMaybe<Scalars["ID"]>;
  categoryName?: InputMaybe<Scalars["String"]>;
  categoryTypeName?: InputMaybe<Scalars["String"]>;
  groupID?: InputMaybe<Scalars["String"]>;
  groupName?: InputMaybe<Scalars["String"]>;
  groupTypeName?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  node?: InputMaybe<Scalars["String"]>;
};

export type CreateNodeInput = {
  aboveNodes?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  node?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<StateEnum>;
  subNodes?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type CreateNode_V2Input = {
  name?: InputMaybe<Scalars["String"]>;
  node?: InputMaybe<Scalars["String"]>;
};

export type CreateProfileExperienceWithChatCvMemoryInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  experienceTypeID?: InputMaybe<ExperienceTypeIdEnum>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type CreateProfileExperienceWithChatCvMemoryOutput = {
  __typename?: "createProfileExperienceWithChatCVMemoryOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type CreateProjectInput = {
  backColorEmoji?: InputMaybe<Scalars["String"]>;
  budget?: InputMaybe<BudgetInput>;
  collaborationLinks?: InputMaybe<Array<InputMaybe<CollaborationLinksInput>>>;
  dates?: InputMaybe<DatesInput>;
  description?: InputMaybe<Scalars["String"]>;
  descriptionOneLine?: InputMaybe<Scalars["String"]>;
  emoji?: InputMaybe<Scalars["String"]>;
  gardenServerID?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Array<InputMaybe<RoleInput>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  stepsJoinProject?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  team?: InputMaybe<Array<InputMaybe<TeamInput>>>;
  title?: InputMaybe<Scalars["String"]>;
};

export type CreateProjectUpdateInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  authorID?: InputMaybe<Scalars["String"]>;
  championID?: InputMaybe<Scalars["String"]>;
  content?: InputMaybe<Scalars["String"]>;
  deWorkLink?: InputMaybe<Scalars["String"]>;
  deadline?: InputMaybe<Scalars["String"]>;
  epicID?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  notifyUserID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  phase?: InputMaybe<PhaseEpicType>;
  priority?: InputMaybe<Scalars["Int"]>;
  projectID?: InputMaybe<Scalars["String"]>;
  roleID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  taskID?: InputMaybe<Scalars["String"]>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  threadDiscordID?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
  token?: InputMaybe<Scalars["String"]>;
};

export type CreateRoleInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  title?: InputMaybe<Scalars["String"]>;
};

export type CreateRoomInput = {
  _id?: InputMaybe<Scalars["String"]>;
  avatar?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  hostID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Scalars["String"]>;
};

export type CreateSkillInput = {
  categorySkills?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_lightcast?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  state?: InputMaybe<ApprovedSkillEnum>;
  subCategorySkill?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type CreateSkillsInput = {
  names?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  state?: InputMaybe<ApprovedSkillEnum>;
};

export type CreateTalentListPositionInput = {
  name?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  talentListID?: InputMaybe<Scalars["ID"]>;
};

export type CvInfoType = {
  __typename?: "cvInfoType";
  cvContent?: Maybe<Scalars["String"]>;
  cvFilename?: Maybe<Scalars["String"]>;
  cvMemory?: Maybe<Array<Maybe<CvMemoryType>>>;
  cvNotes?: Maybe<Scalars["String"]>;
  cvPreparationBio?: Maybe<Scalars["Boolean"]>;
  cvPreparationDone?: Maybe<Scalars["Boolean"]>;
  cvPreparationMemory?: Maybe<Scalars["Boolean"]>;
  cvPreparationNodes?: Maybe<Scalars["Boolean"]>;
  cvPreparationPreviousProjects?: Maybe<Scalars["Boolean"]>;
};

export type CvMapKgInput = {
  message?: InputMaybe<Scalars["String"]>;
};

export type CvMapKgOutput = {
  __typename?: "cvMapKGOutput";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type CvMemoryType = {
  __typename?: "cvMemoryType";
  memoryContent?: Maybe<Scalars["String"]>;
  pineConeID?: Maybe<Scalars["String"]>;
};

export type DatesInput = {
  complition?: InputMaybe<Scalars["String"]>;
  kickOff?: InputMaybe<Scalars["String"]>;
};

export type DatesType = {
  __typename?: "datesType";
  complition?: Maybe<Scalars["String"]>;
  kickOff?: Maybe<Scalars["String"]>;
};

export type DeleteAllEndorsementsInput = {
  deleteAll?: InputMaybe<Scalars["Boolean"]>;
};

export type DeleteCardMemoryInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  companyID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type DeleteErrorInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type DeleteMemberInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type DeleteMemoriesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  label?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type DeleteNodeInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type DeleteNodesFromMemberInRoomInput = {
  RoomID?: InputMaybe<Scalars["ID"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type DeleteNodesFromMemberInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type DeleteNodesToProjectRoleInput = {
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectRoleID?: InputMaybe<Scalars["ID"]>;
};

export type DeletePositionCandidateInput = {
  onlyScoreCard?: InputMaybe<Scalars["Boolean"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type DeleteProjectInput = {
  projectID?: InputMaybe<Scalars["ID"]>;
};

export type DeleteQueryResponseInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type DeleteQuestionsToAskPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  questionID?: InputMaybe<Scalars["ID"]>;
};

export type DiscussionMessage = {
  __typename?: "discussionMessage";
  content?: Maybe<Scalars["String"]>;
  role?: Maybe<Scalars["String"]>;
};

export type DiscussionMessageInput = {
  content?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Scalars["String"]>;
};

export type DynamicSearchGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type DynamicSearchToMemberCategoryGroupInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type DynamicSearchToMemberGraphGptInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
  showOnlyRelevant?: InputMaybe<Scalars["Boolean"]>;
};

export type DynamicSearchToMemberGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type DynamicSearchToMemberGraphV2Input = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type DynamicSearchToProjectGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectID?: InputMaybe<Scalars["ID"]>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type EdenAiTalSearchExpirienceInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  experienceTypeID?: InputMaybe<ExperienceTalSearchTypeIdEnum>;
  message?: InputMaybe<Scalars["String"]>;
};

export type EdenAiTalSearchExpirienceOutput = {
  __typename?: "edenAITalSearchExpirienceOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGptCreateProfileExperienceChatApiInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  experienceTypeID?: InputMaybe<ExperienceTypeIdEnum>;
  message?: InputMaybe<Scalars["String"]>;
  useMemory?: InputMaybe<Scalars["Boolean"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGptCreateProfileExperienceChatApiOutput = {
  __typename?: "edenGPTCreateProfileExperienceChatAPIOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGptEndorseChatApiInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGptEndorseChatApiOutput = {
  __typename?: "edenGPTEndorseChatAPIOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGptReviewChatApiInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGptReviewChatApiOutput = {
  __typename?: "edenGPTReviewChatAPIOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTreplyChatApiInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGpTreplyChatApiOutput = {
  __typename?: "edenGPTreplyChatAPIOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTreplyChatApi_V2Input = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGpTreplyChatApi_V2Output = {
  __typename?: "edenGPTreplyChatAPI_V2Output";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTreplyChatApi_V3Input = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  executedTasks?: InputMaybe<Array<InputMaybe<ExecutedActionInput>>>;
  message?: InputMaybe<Scalars["String"]>;
  previusTaskDoneID?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGpTreplyChatApi_V3Output = {
  __typename?: "edenGPTreplyChatAPI_V3Output";
  executeTaskType?: Maybe<Scalars["String"]>;
  executedTasks?: Maybe<Array<Maybe<ExecutedActionType>>>;
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTreplyInput = {
  message?: InputMaybe<Scalars["String"]>;
};

export type EdenGpTreplyMemoryInput = {
  memorySort?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type EdenGpTreplyMemoryOutput = {
  __typename?: "edenGPTreplyMemoryOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTreplyOutput = {
  __typename?: "edenGPTreplyOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTsearchProfilesInput = {
  message?: InputMaybe<Scalars["String"]>;
  profileIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type EdenGpTsearchProfilesOutput = {
  __typename?: "edenGPTsearchProfilesOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdenGpTsummaryProfileInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
};

export type EdenGpTsummaryProfileOutput = {
  __typename?: "edenGPTsummaryProfileOutput";
  reply?: Maybe<Scalars["String"]>;
};

export type EdgeSetting = {
  hiddenEdge?: InputMaybe<Scalars["Boolean"]>;
  mainEdge?: InputMaybe<EdgeSettingIn>;
  moreThanSplit?: InputMaybe<Scalars["Int"]>;
  splitEdge?: InputMaybe<Array<InputMaybe<EdgeSettingSplitIn>>>;
};

export type EdgeSettingIn = {
  nodeTypeSource?: InputMaybe<Scalars["String"]>;
  nodeTypeTarget?: InputMaybe<Scalars["String"]>;
  style?: InputMaybe<StyleEdgeIn>;
};

export type EdgeSettingSplitIn = {
  nodeTypeMiddle?: InputMaybe<Scalars["String"]>;
  nodeTypeSource?: InputMaybe<Scalars["String"]>;
  nodeTypeTarget?: InputMaybe<Scalars["String"]>;
};

export type EditCardMemoryInput = {
  batchCards?: InputMaybe<Array<InputMaybe<BatchCardsInput>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
  updateCandidatesPosition?: InputMaybe<Scalars["Boolean"]>;
};

export type EmailInput = {
  from: Scalars["String"];
  html?: InputMaybe<Scalars["String"]>;
  subject?: InputMaybe<Scalars["String"]>;
  text?: InputMaybe<Scalars["String"]>;
  to: Scalars["String"];
};

export enum EmployeeRole {
  Admin = "ADMIN",
  Employee = "EMPLOYEE",
}

export enum EmployeeStatus {
  Active = "ACTIVE",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export type EndorcmentInput = {
  registeredAt?: InputMaybe<Scalars["String"]>;
  skillID?: InputMaybe<Scalars["ID"]>;
};

export type EndorseAttributeInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  attribute?: InputMaybe<AttributesEnum>;
};

export type EndorseNode = {
  __typename?: "endorseNode";
  confidence?: Maybe<Scalars["Float"]>;
  node?: Maybe<Node>;
};

export type EndorseNodeInput = {
  confidence?: InputMaybe<Scalars["Float"]>;
  nodeID?: InputMaybe<Scalars["ID"]>;
};

export enum EndorseOrReviewEnum {
  Endorse = "ENDORSE",
  Review = "REVIEW",
}

export type EndorseSummaryType = {
  __typename?: "endorseSummaryType";
  averageStake?: Maybe<Scalars["Float"]>;
  averageStars?: Maybe<Scalars["Float"]>;
  endorsers?: Maybe<Array<Maybe<MembersSmallType>>>;
  mainNodes?: Maybe<Array<Maybe<EndorseNode>>>;
  numberEndorsement?: Maybe<Scalars["Int"]>;
  summary?: Maybe<Scalars["String"]>;
  totalStake?: Maybe<Scalars["Float"]>;
};

export type Endorsements = {
  __typename?: "endorsements";
  arweaveTransactionID?: Maybe<Scalars["String"]>;
  discussion?: Maybe<Array<Maybe<DiscussionMessage>>>;
  endorseNodes?: Maybe<Array<Maybe<EndorseNode>>>;
  endorseOrReview?: Maybe<EndorseOrReviewEnum>;
  endorsementMessage?: Maybe<Scalars["String"]>;
  endorser?: Maybe<MembersSmallType>;
  income?: Maybe<Scalars["Float"]>;
  stake?: Maybe<Scalars["Float"]>;
  stars?: Maybe<Scalars["Int"]>;
};

export type EndorsementsSendStatsType = {
  __typename?: "endorsementsSendStatsType";
  reputation?: Maybe<Scalars["Float"]>;
  totalReward?: Maybe<Scalars["Float"]>;
  unclaimedReward?: Maybe<Scalars["Float"]>;
};

export type EnterRoomInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  roomID?: InputMaybe<Scalars["ID"]>;
};

export enum ErrorTypeEnum {
  Bot = "BOT",
  Frontend = "FRONTEND",
  Server = "SERVER",
}

export type ErrorsInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  errorType?: InputMaybe<ErrorTypeEnum>;
};

export type EvaluateAnswerEdenAiInput = {
  answer?: InputMaybe<Scalars["String"]>;
  bestAnswer?: InputMaybe<Scalars["String"]>;
  findReason?: InputMaybe<Scalars["Boolean"]>;
  question?: InputMaybe<Scalars["String"]>;
};

export type EvaluateAnswerEdenAiOutput = {
  __typename?: "evaluateAnswerEdenAIOutput";
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type ExecutedActionInput = {
  percentageCompleted?: InputMaybe<Scalars["Int"]>;
  taskType?: InputMaybe<Scalars["String"]>;
  taskTypeID?: InputMaybe<Scalars["String"]>;
};

export type ExecutedActionType = {
  __typename?: "executedActionType";
  percentageCompleted?: Maybe<Scalars["Int"]>;
  taskType?: Maybe<Scalars["String"]>;
  taskTypeID?: Maybe<Scalars["String"]>;
};

export type ExperienceLevelInput = {
  total?: InputMaybe<Scalars["Int"]>;
  years?: InputMaybe<Scalars["Int"]>;
};

export type ExperienceLevelType = {
  __typename?: "experienceLevelType";
  total?: Maybe<Scalars["Int"]>;
  years?: Maybe<Scalars["Int"]>;
};

export enum ExperienceTalSearchTypeIdEnum {
  CultureFit = "CULTURE_FIT",
  Industries = "INDUSTRIES",
  SkillsExperience = "SKILLS_EXPERIENCE",
}

export enum ExperienceTypeIdEnum {
  Background = "BACKGROUND",
  CareerGoalsAspirations = "CAREER_GOALS_ASPIRATIONS",
  GeneralConversation = "GENERAL_CONVERSATION",
  SkillsExperience = "SKILLS_EXPERIENCE",
  WorkPreferences = "WORK_PREFERENCES",
}

export enum ExploreFeatureEnum {
  ExploreProjectsButton = "exploreProjectsButton",
  FindFriendButton = "findFriendButton",
  GrantButton = "grantButton",
  SkillButton = "skillButton",
}

export type FindAllProjectsTeamsAnouncmentsInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  dateEnd?: InputMaybe<Scalars["String"]>;
  dateStart?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindAllProjectsTeamsAnouncmentsOutput = {
  __typename?: "findAllProjectsTeamsAnouncmentsOutput";
  _id?: Maybe<Scalars["ID"]>;
  project?: Maybe<Project>;
  team?: Maybe<Array<Maybe<TeamsType>>>;
};

export type FindCandidateInfoForMemberInput = {
  memberID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindCardMemoriesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  companyID?: InputMaybe<Scalars["ID"]>;
  connectCardType?: InputMaybe<ConnectCardTypeEnum>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type FindChatInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  threadID?: InputMaybe<Scalars["ID"]>;
};

export type FindCompaniesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindCompanyFromSlugInput = {
  slug?: InputMaybe<Scalars["String"]>;
};

export type FindCompanyInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FindConversationInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  skip?: InputMaybe<Scalars["Int"]>;
  subjectConv?: InputMaybe<SubjectConversationInput>;
  typeConversation?: InputMaybe<TypeConversationEnum>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type FindConversationsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  convKey?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  positionID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  positionTrainEdenAI?: InputMaybe<Scalars["Boolean"]>;
  summaryReady?: InputMaybe<Scalars["Boolean"]>;
  userID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindEndorsementLinkInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindEndorsementsInput = {
  endorsementsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  userReceive?: InputMaybe<Scalars["ID"]>;
  userSend?: InputMaybe<Scalars["ID"]>;
};

export enum FindEnum {
  Member = "Member",
  ProjectRole = "ProjectRole",
}

export type FindEpicInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindGardenInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  dateEnd?: InputMaybe<Scalars["String"]>;
  dateStart?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindGardenOutput = {
  __typename?: "findGardenOutput";
  _id?: Maybe<Scalars["ID"]>;
  project?: Maybe<Project>;
  team?: Maybe<Array<Maybe<TeamsType_Garden>>>;
};

export type FindGrantsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindKeyAttributeAndPotentialCandidateInput = {
  membersID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type FindKeyAttributeAndPotentialPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type FindLastNumMessagesChatExternalAppInput = {
  chatID_TG?: InputMaybe<Scalars["ID"]>;
  communicationAuthorType?: InputMaybe<CommunicationAuthorTypeEnum>;
  lastNumMessages?: InputMaybe<Scalars["Int"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type FindMemberGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindMemberInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  discordName?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  telegramChatID?: InputMaybe<Scalars["ID"]>;
};

export type FindMemberToMemberGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberOneID?: InputMaybe<Scalars["ID"]>;
  memberTwoID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindMemberToProjectGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  projectID?: InputMaybe<Scalars["ID"]>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindMembersInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindMemoriesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  label?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type FindMessageInput = {
  discordID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Scalars["ID"]>;
};

export type FindMessageInputPaginated = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  request?: InputMaybe<FindMessageInput>;
  sortBy?: InputMaybe<SortByMessage>;
};

export type FindMultipleMembersProjectsGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  membersID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  projectsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindNodeInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FindNodesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  name?: InputMaybe<Scalars["String"]>;
  names?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  node?: InputMaybe<Scalars["String"]>;
  recalculate_en?: InputMaybe<RecalculateEnum>;
  selectedNodes?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  show_match_v2?: InputMaybe<Scalars["Boolean"]>;
};

export type FindOneMemberToMembersGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindPositionCandidateInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type FindPositionInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  telegramChatID?: InputMaybe<Scalars["String"]>;
};

export type FindPositionsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindPositionsOfCommunityInput = {
  communityID?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
};

export type FindPrioritiesTrainEdenAiInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type FindPrioritiesTrainEdenAiOutput = {
  __typename?: "findPrioritiesTrainEdenAIOutput";
  priorities?: Maybe<Array<Maybe<PrioritiesType>>>;
  success?: Maybe<Scalars["Boolean"]>;
  tradeOffs?: Maybe<Array<Maybe<TradeOffsType>>>;
};

export type FindProjectGraphInput = {
  edgeSettings?: InputMaybe<Array<InputMaybe<EdgeSetting>>>;
  nodeSettings?: InputMaybe<Array<InputMaybe<NodeSetting>>>;
  projectID?: InputMaybe<Scalars["ID"]>;
  showAvatar?: InputMaybe<Scalars["Boolean"]>;
};

export type FindProjectInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  gardenServerID?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindProjectUpdatesInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  dateEnd?: InputMaybe<Scalars["String"]>;
  dateStart?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  projectID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  roleID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindProjectsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  gardenServerID?: InputMaybe<Scalars["String"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindProjects_RecommendedToUserInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindProjects_RequireSkillInput = {
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindQueryResponsesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  phase?: InputMaybe<PhaseQueryResponseEnum>;
  responderID?: InputMaybe<Scalars["ID"]>;
  responderType?: InputMaybe<SendRespTypeEnum>;
  senderID?: InputMaybe<Scalars["ID"]>;
  senderType?: InputMaybe<SendRespTypeEnum>;
  sentFlag?: InputMaybe<Scalars["Boolean"]>;
};

export type FindQuestionEdenAiInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FindReviewsInput = {
  reviewsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  userReceive?: InputMaybe<Scalars["ID"]>;
  userSend?: InputMaybe<Scalars["ID"]>;
};

export type FindRoleTemplateInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FindRoleTemplatesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindRolesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  teamID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindRoomsInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Scalars["String"]>;
};

export type FindServersInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindSkillCategoriesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  id_lightcast?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindSkillCategoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  id_lightcast?: InputMaybe<Scalars["ID"]>;
};

export type FindSkillInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  id_lightcast?: InputMaybe<Scalars["ID"]>;
};

export type FindSkillSubCategoriesInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type FindSkillSubCategoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FindSkillsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  recalculateMembers?: InputMaybe<Scalars["Boolean"]>;
  recalculateProjectRoles?: InputMaybe<Scalars["Boolean"]>;
};

export type FindSkillsInputPaginated = {
  after?: InputMaybe<Scalars["String"]>;
  before?: InputMaybe<Scalars["String"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  request?: InputMaybe<FindSkillsInput>;
  sortBy?: InputMaybe<SortBySkill>;
};

export type FindTeamsInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type FindUserTalentListPositionInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type FitRequirementsAnalysisType = {
  __typename?: "fitRequirementsAnalysisType";
  content?: Maybe<Scalars["String"]>;
};

export type GardenUpdateType = {
  __typename?: "gardenUpdateType";
  epic?: Maybe<Array<Maybe<Epic>>>;
  task?: Maybe<Array<Maybe<ProjectUpdate>>>;
};

export type GeneralDetailsType = {
  __typename?: "generalDetailsType";
  contractDuration?: Maybe<Scalars["String"]>;
  contractType?: Maybe<Scalars["String"]>;
  officeLocation?: Maybe<Scalars["String"]>;
  officePolicy?: Maybe<Scalars["String"]>;
  socials?: Maybe<SocialsType>;
  startDate?: Maybe<Scalars["String"]>;
  visaRequired?: Maybe<Scalars["Boolean"]>;
  yearlySalary?: Maybe<YearlySalaryType>;
};

export type IdentifyCategoryAndReplyInput = {
  chatID_TG?: InputMaybe<Scalars["ID"]>;
  message?: InputMaybe<Scalars["String"]>;
  replyFlag?: InputMaybe<Scalars["Boolean"]>;
};

export type IdentifyCategoryAndReplyOutput = {
  __typename?: "identifyCategoryAndReplyOutput";
  category?: Maybe<CategoryMessageCategoryEnum>;
  reply?: Maybe<Scalars["String"]>;
};

export type InitiateConnectionTelegramInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type InputToGptInput = {
  descriptionProject?: InputMaybe<Scalars["String"]>;
  expertiseRole?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  oneLinerProject?: InputMaybe<Scalars["String"]>;
  titleRole?: InputMaybe<Scalars["String"]>;
};

export type InputToGptOutput = {
  __typename?: "inputToGPTOutput";
  benefitsRole?: Maybe<Array<Maybe<Scalars["String"]>>>;
  descriptionRole?: Maybe<Scalars["String"]>;
  expectationsRole?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type InterviewEdenAiInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
  positionTrainEdenAI?: InputMaybe<Scalars["Boolean"]>;
  questionAskingID?: InputMaybe<Scalars["ID"]>;
  questionAskingNow?: InputMaybe<Scalars["String"]>;
  timesAsked?: InputMaybe<Scalars["Int"]>;
  unansweredQuestions?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  unansweredQuestionsArr?: InputMaybe<
    Array<InputMaybe<UnansweredQuestionsInput>>
  >;
  useMemory?: InputMaybe<Scalars["Boolean"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type InterviewEdenAiOutput = {
  __typename?: "interviewEdenAIOutput";
  conversationID?: Maybe<Scalars["ID"]>;
  date?: Maybe<Scalars["Date"]>;
  questionAskingNow?: Maybe<Scalars["String"]>;
  reply?: Maybe<Scalars["String"]>;
  timesAsked?: Maybe<Scalars["Int"]>;
  unansweredQuestions?: Maybe<Array<Maybe<Scalars["String"]>>>;
  unansweredQuestionsArr?: Maybe<Array<Maybe<UnansweredQuestionsType>>>;
};

export type InterviewEdenGpt4onlyInput = {
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  positionID?: InputMaybe<Scalars["ID"]>;
  positionTrainEdenAI?: InputMaybe<Scalars["Boolean"]>;
  useMemory?: InputMaybe<Scalars["Boolean"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type InterviewEdenGpt4onlyOutput = {
  __typename?: "interviewEdenGPT4onlyOutput";
  conversationID?: Maybe<Scalars["ID"]>;
  date?: Maybe<Scalars["Date"]>;
  reply?: Maybe<Scalars["String"]>;
};

export type InterviewQuestionCreationUserInput = {
  cvContent?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type InterviewQuestionsForCandidateType = {
  __typename?: "interviewQuestionsForCandidateType";
  originalContent?: Maybe<Scalars["String"]>;
  originalQuestionID?: Maybe<Scalars["ID"]>;
  personalizedContent?: Maybe<Scalars["String"]>;
};

export enum LevelEnum {
  Junior = "junior",
  Learning = "learning",
  Mid = "mid",
  Senior = "senior",
}

export type LinkInput = {
  name?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["String"]>;
};

export type LinkType = {
  __typename?: "linkType";
  name?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type LoginInput = {
  email?: InputMaybe<Scalars["String"]>;
  password?: InputMaybe<Scalars["String"]>;
};

export type MatchMembersToProjectInput = {
  projectID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchMembersToProjectOutput = {
  __typename?: "matchMembersToProjectOutput";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  member?: Maybe<Members>;
};

export type MatchMembersToProjectRoleInput = {
  projectRoleID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchMembersToProjectRoleOutput = {
  __typename?: "matchMembersToProjectRoleOutput";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  member?: Maybe<Members>;
};

export type MatchMembersToSkillInput = {
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type MatchMembersToSkillOutput = {
  __typename?: "matchMembersToSkillOutput";
  extraMatch?: Maybe<Scalars["Boolean"]>;
  matchPercentage?: Maybe<MatchPercentage>;
  member?: Maybe<Members>;
  nodesPercentage?: Maybe<Array<Maybe<NodesPercentageType>>>;
  skillsPercentage?: Maybe<Array<Maybe<SkillsPercentage>>>;
};

export type MatchMembersToUserInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchMembersToUserOutput = {
  __typename?: "matchMembersToUserOutput";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  member?: Maybe<Members>;
};

export type MatchNodesToMembersInput = {
  budgetAmount?: InputMaybe<Scalars["Float"]>;
  hoursPerWeek?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  page?: InputMaybe<Scalars["Int"]>;
  preference?: InputMaybe<Array<InputMaybe<PreferencesEnum>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchNodesToMembers_Ai4Input = {
  availability?: InputMaybe<AvailabilityInput>;
  budget?: InputMaybe<BudgetInputT>;
  experienceLevel?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  membersIDallow?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  page?: InputMaybe<Scalars["Int"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  weightModules?: InputMaybe<Array<InputMaybe<WeightModulesInput>>>;
};

export type MatchNodesToProjectRolesInput = {
  limit?: InputMaybe<Scalars["Int"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  page?: InputMaybe<Scalars["Int"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchPrepareNodeInput = {
  find?: InputMaybe<FindEnum>;
  nodeID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  weightSkills?: InputMaybe<Scalars["Boolean"]>;
};

export type MatchPrepareNode_Ai4Input = {
  distancePenalty?: InputMaybe<Array<InputMaybe<Scalars["Float"]>>>;
  find?: InputMaybe<FindEnum>;
  nodeID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchPrepareSkillToMembersInput = {
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillID?: InputMaybe<Scalars["ID"]>;
};

export type MatchPrepareSkillToMembersOutput = {
  __typename?: "matchPrepareSkillToMembersOutput";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  member?: Maybe<Members>;
};

export type MatchPrepareSkillToProjectRolesInput = {
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillID?: InputMaybe<Scalars["ID"]>;
};

export type MatchProjectRoles = {
  __typename?: "matchProjectRoles";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  projectRole?: Maybe<RoleType>;
  realPercebtage?: Maybe<Scalars["Float"]>;
};

export type MatchProjectsToMemberInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type MatchSkillsToMembersInput = {
  budgetAmount?: InputMaybe<Scalars["Float"]>;
  hoursPerWeek?: InputMaybe<Scalars["Int"]>;
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type MatchSkillsToProjectsInput = {
  limit?: InputMaybe<Scalars["Int"]>;
  page?: InputMaybe<Scalars["Int"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skillsID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type MatchSkillsToProjectsOutput = {
  __typename?: "matchSkillsToProjectsOutput";
  commonSkills?: Maybe<Array<Maybe<Skills>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  project?: Maybe<Project>;
  projectRoles?: Maybe<Array<Maybe<MatchProjectRoles>>>;
  realPercebtage?: Maybe<Scalars["Float"]>;
};

export type Match_ProjectToUserInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  roleID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type Match_V2Type = {
  __typename?: "match_v2Type";
  conn_node_wh?: Maybe<Array<Maybe<Conn_Node_WhType>>>;
  k_sum?: Maybe<Scalars["Float"]>;
  nodeResID?: Maybe<Scalars["ID"]>;
  numPath?: Maybe<Scalars["Float"]>;
  serverID?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  type?: Maybe<TypeEnumMp>;
  wh_k?: Maybe<Scalars["Float"]>;
  wh_k_arr?: Maybe<Array<Maybe<Wh_K_ArrType>>>;
  wh_sum?: Maybe<Scalars["Float"]>;
};

export type Match_V2_UpdateType = {
  __typename?: "match_v2_updateType";
  member?: Maybe<Scalars["Boolean"]>;
  projectRole?: Maybe<Scalars["Boolean"]>;
};

export type MemberDataConnectedTgInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type MemberPieChartNodeCategoriesInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type MemberPieChartNodeCategoriesOutput = {
  __typename?: "memberPieChartNodeCategoriesOutput";
  categoryName?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<Node>>>;
  percentage?: Maybe<Scalars["Float"]>;
};

export type MemberRadioChartCharacterAttributesInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type MemberRadioChartCharacterAttributesOutput = {
  __typename?: "memberRadioChartCharacterAttributesOutput";
  attributeName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
};

export type Members_AutocompleteInput = {
  search?: InputMaybe<Scalars["String"]>;
};

export enum MemoriesTypeEnum {
  New = "NEW",
  Old = "OLD",
}

export type MemoryMemberType = {
  __typename?: "memoryMemberType";
  core?: Maybe<Scalars["String"]>;
};

export type MemoryPositionType = {
  __typename?: "memoryPositionType";
  core?: Maybe<Scalars["String"]>;
};

export type MemoryStateType = {
  __typename?: "memoryStateType";
  content?: Maybe<Scalars["String"]>;
  primitives?: Maybe<Array<Maybe<PrimitiveType>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type MessageChat = {
  content?: InputMaybe<Scalars["String"]>;
  date?: InputMaybe<Scalars["Date"]>;
  role?: InputMaybe<Scalars["String"]>;
};

export type MessageInp = {
  date?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKgInput = {
  message?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKgOutput = {
  __typename?: "messageMapKGOutput";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type MessageMapKg_V2Input = {
  message?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKg_V2Output = {
  __typename?: "messageMapKG_V2Output";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type MessageMapKg_V3Input = {
  assistantMessage?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKg_V3Output = {
  __typename?: "messageMapKG_V3Output";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type MessageMapKg_V4Input = {
  assistantMessage?: InputMaybe<Scalars["String"]>;
  message?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKg_V4Output = {
  __typename?: "messageMapKG_V4Output";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type MessageMapKg_V5Input = {
  assistantMessage?: InputMaybe<Scalars["String"]>;
  conversation?: InputMaybe<Array<InputMaybe<MessageChat>>>;
  message?: InputMaybe<Scalars["String"]>;
};

export type MessageMapKg_V5Output = {
  __typename?: "messageMapKG_V5Output";
  keywords?: Maybe<Array<Maybe<KeywordValue>>>;
};

export type MessageToGptInput = {
  category?: InputMaybe<CategoryEnum>;
  message?: InputMaybe<Scalars["String"]>;
  prompt?: InputMaybe<Scalars["String"]>;
};

export type MessageToGptOutput = {
  __typename?: "messageToGPTOutput";
  message?: Maybe<Scalars["String"]>;
};

export type MetadataType = {
  __typename?: "metadataType";
  database?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  positionID?: Maybe<Scalars["String"]>;
  userID?: Maybe<Scalars["String"]>;
};

export type MostRelevantMemberNodeType = {
  __typename?: "mostRelevantMemberNodeType";
  node?: Maybe<Node>;
  score?: Maybe<Scalars["Float"]>;
};

export type MoveCandidateToPositionInput = {
  positionNewID?: InputMaybe<Scalars["ID"]>;
  positionOldID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type MoveCandidateToPosition_V2Input = {
  positionNewID?: InputMaybe<Scalars["ID"]>;
  positionOldID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type MoveCandidateToPosition_V3Input = {
  positionNewID?: InputMaybe<Scalars["ID"]>;
  positionOldID?: InputMaybe<Scalars["ID"]>;
  sendMessageCandidateTG?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type NetworkInput = {
  endorcment?: InputMaybe<Array<InputMaybe<EndorcmentInput>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type NewTweetProjectInput = {
  approved?: InputMaybe<Scalars["Boolean"]>;
  author?: InputMaybe<Scalars["String"]>;
  content?: InputMaybe<Scalars["String"]>;
  projectID?: InputMaybe<Scalars["ID"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type NodeCategoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  numberNodes?: InputMaybe<Scalars["Int"]>;
};

export type NodeSetting = {
  style?: InputMaybe<StyleIn>;
  type?: InputMaybe<Scalars["String"]>;
};

export type NodeTrustType = {
  __typename?: "nodeTrustType";
  endorseTrust?: Maybe<Scalars["Float"]>;
  totalTrust?: Maybe<Scalars["Float"]>;
};

export type NodesId_LevelInput = {
  aboveNodes?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  level?: InputMaybe<Scalars["Float"]>;
  nodeID?: InputMaybe<Scalars["ID"]>;
  orderIndex?: InputMaybe<Scalars["Int"]>;
};

export type NodesPercentageType = {
  __typename?: "nodesPercentageType";
  conn_nodeIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  mostRelevantMemberNodes?: Maybe<Array<Maybe<MostRelevantMemberNodeType>>>;
  node?: Maybe<Node>;
  totalPercentage?: Maybe<Scalars["Float"]>;
};

export type NodesType = {
  __typename?: "nodesType";
  aboveNodes?: Maybe<Array<Maybe<Node>>>;
  level?: Maybe<Scalars["Int"]>;
  nodeData?: Maybe<Node>;
  orderIndex?: Maybe<Scalars["Int"]>;
  trust?: Maybe<NodeTrustType>;
  weight?: Maybe<Scalars["Float"]>;
};

export type Nodes_AutocompleteInput = {
  nodeType?: InputMaybe<Scalars["String"]>;
  rootType?: InputMaybe<Scalars["String"]>;
  search?: InputMaybe<Scalars["String"]>;
};

export type NotesInterviewType = {
  __typename?: "notesInterviewType";
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Array<Maybe<Scalars["String"]>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type NotesInterviewType2 = {
  __typename?: "notesInterviewType2";
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Array<Maybe<Scalars["String"]>>>;
  score?: Maybe<Scalars["Float"]>;
};

export type OnboardingInput = {
  percentage?: InputMaybe<Scalars["Int"]>;
  signup?: InputMaybe<Scalars["Boolean"]>;
};

export type OnboardingType = {
  __typename?: "onboardingType";
  percentage?: Maybe<Scalars["Int"]>;
  signup?: Maybe<Scalars["Boolean"]>;
};

export type PastSearchInput = {
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type PathType = {
  __typename?: "pathType";
  hop?: Maybe<Scalars["Float"]>;
  weight?: Maybe<Scalars["Float"]>;
};

export enum PhaseEpicType {
  Archive = "archive",
  Open = "open",
}

export enum PhaseQueryResponseEnum {
  Archived = "ARCHIVED",
  Query = "QUERY",
  Responded = "RESPONDED",
  Viewed = "VIEWED",
}

export enum PhaseType {
  Committed = "committed",
  Engaged = "engaged",
  Invited = "invited",
  Rejected = "rejected",
  Shortlisted = "shortlisted",
}

export type PineconeDbType = {
  __typename?: "pineconeDBType";
  metadata?: Maybe<MetadataType>;
  pineconeID?: Maybe<Scalars["String"]>;
  text?: Maybe<Scalars["String"]>;
};

export type PitchPositionToCandidateInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type PitchPositionToCandidateOutput = {
  __typename?: "pitchPositionToCandidateOutput";
  message?: Maybe<Scalars["String"]>;
  queryResponse?: Maybe<QueryResponse>;
};

export type PositionDataConnectedTgInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export type PositionSuggestQuestionsAskCandidateInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type PositionSuggestQuestionsAskCandidateOutput = {
  __typename?: "positionSuggestQuestionsAskCandidateOutput";
  questionSuggest?: Maybe<Array<Maybe<QuestionSuggestType>>>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type PositionTextAndConvoToReportCriteriaInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  updatedReport?: InputMaybe<Scalars["String"]>;
};

export type PositionTextAndConvoToReportCriteriaOutput = {
  __typename?: "positionTextAndConvoToReportCriteriaOutput";
  report?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type PositionTextToExtraQuestionsInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  positionText?: InputMaybe<Scalars["String"]>;
};

export type PositionTextToExtraQuestionsOutput = {
  __typename?: "positionTextToExtraQuestionsOutput";
  questions?: Maybe<Array<Maybe<InterviewQuestionsForCandidateType>>>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type PositionsAppliedType = {
  __typename?: "positionsAppliedType";
  positionID?: Maybe<Scalars["ID"]>;
};

export type PositionsRequirementsType = {
  __typename?: "positionsRequirementsType";
  benefits?: Maybe<Array<Maybe<Scalars["String"]>>>;
  content?: Maybe<Scalars["String"]>;
  futurePotential?: Maybe<Array<Maybe<AttributeType>>>;
  keyAttributes?: Maybe<Array<Maybe<AttributeType>>>;
  notesRequirConv?: Maybe<Scalars["String"]>;
  originalContent?: Maybe<Scalars["String"]>;
  positionPreparationMemory?: Maybe<Scalars["Boolean"]>;
  priorities?: Maybe<Array<Maybe<PrioritiesType>>>;
  roleDescription?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tradeOffs?: Maybe<Array<Maybe<TradeOffsType>>>;
};

export type PrefPastSearch = {
  __typename?: "prefPastSearch";
  nodesID?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export enum PreferencesEnum {
  FindCoFounder = "findCoFounder",
  FindMentee = "findMentee",
  FindMentor = "findMentor",
  FindProject = "findProject",
  FindUser = "findUser",
}

export type PreferencesInput = {
  interestedMatch?: InputMaybe<Scalars["Boolean"]>;
  notify?: InputMaybe<Scalars["Boolean"]>;
  pastSearch?: InputMaybe<Array<InputMaybe<PastSearchInput>>>;
  percentage?: InputMaybe<Scalars["Int"]>;
  preference?: InputMaybe<PreferencesEnum>;
};

export type PreferencesType = {
  __typename?: "preferencesType";
  findCoFounder?: Maybe<PreferencesTypeFind>;
  findMentee?: Maybe<PreferencesTypeFind>;
  findMentor?: Maybe<PreferencesTypeFind>;
  findProject?: Maybe<PreferencesTypeFind>;
  findUser?: Maybe<PreferencesTypeFind>;
  interestedMatch?: Maybe<Scalars["Boolean"]>;
  notify?: Maybe<Scalars["Boolean"]>;
};

export type PreferencesTypeFind = {
  __typename?: "preferencesTypeFind";
  interestedMatch?: Maybe<Scalars["Boolean"]>;
  notify?: Maybe<Scalars["Boolean"]>;
  pastSearch?: Maybe<Array<Maybe<PrefPastSearch>>>;
  percentage?: Maybe<Scalars["Int"]>;
};

export type PreviousProjectsInput = {
  description?: InputMaybe<Scalars["String"]>;
  endDate?: InputMaybe<Scalars["String"]>;
  link?: InputMaybe<Scalars["String"]>;
  picture?: InputMaybe<Scalars["String"]>;
  positionName?: InputMaybe<Scalars["String"]>;
  startDate?: InputMaybe<Scalars["String"]>;
  title?: InputMaybe<Scalars["String"]>;
};

export type PreviousProjectsType = {
  __typename?: "previousProjectsType";
  description?: Maybe<Scalars["String"]>;
  endDate?: Maybe<Scalars["String"]>;
  link?: Maybe<Scalars["String"]>;
  picture?: Maybe<Scalars["String"]>;
  positionName?: Maybe<Scalars["String"]>;
  startDate?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export type PrimitiveType = {
  __typename?: "primitiveType";
  score?: Maybe<Scalars["Float"]>;
  type?: Maybe<Scalars["String"]>;
};

export type PrioritiesInput = {
  priority?: InputMaybe<Scalars["String"]>;
};

export type PrioritiesType = {
  __typename?: "prioritiesType";
  priority?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
};

export type ProjectMatchType = {
  __typename?: "projectMatchType";
  matchPercentage?: Maybe<Scalars["Float"]>;
  projectData?: Maybe<Project>;
  role?: Maybe<RoleType>;
};

export type ProjectMemberType = {
  __typename?: "projectMemberType";
  champion?: Maybe<Scalars["Boolean"]>;
  favorite?: Maybe<Scalars["Boolean"]>;
  info?: Maybe<Project>;
  phase?: Maybe<PhaseType>;
  role?: Maybe<RoleType>;
};

export type ProjectUserMatchType = {
  __typename?: "projectUserMatchType";
  matchPercentage?: Maybe<Scalars["Float"]>;
  projectData?: Maybe<Project>;
  skillsDontMatch?: Maybe<Array<Maybe<Skills>>>;
  skillsMatch?: Maybe<Array<Maybe<Skills>>>;
};

export type QueryResponseUpdatedInput = {
  _id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  phase?: InputMaybe<PhaseQueryResponseEnum>;
  responderID?: InputMaybe<Scalars["ID"]>;
  responderType?: InputMaybe<SendRespTypeEnum>;
  senderID?: InputMaybe<Scalars["ID"]>;
  senderType?: InputMaybe<SendRespTypeEnum>;
};

export type QuestionAnsweredType = {
  __typename?: "questionAnsweredType";
  questionContent?: Maybe<Scalars["String"]>;
  questionID?: Maybe<Scalars["ID"]>;
  subConversationAnswer?: Maybe<Array<Maybe<ConversationType>>>;
  summaryOfAnswer?: Maybe<Scalars["String"]>;
  summaryOfAnswerSmall?: Maybe<Scalars["String"]>;
};

export type QuestionQueryType = {
  __typename?: "questionQueryType";
  content?: Maybe<Scalars["String"]>;
};

export type QuestionSuggestType = {
  __typename?: "questionSuggestType";
  IDCriteria?: Maybe<Scalars["ID"]>;
  category?: Maybe<Scalars["String"]>;
  question?: Maybe<Scalars["String"]>;
};

export enum Range {
  Days = "days",
  Months = "months",
}

export enum Range2 {
  Daily = "daily",
  Months = "months",
  Weekly = "weekly",
}

export type ReCreateMemberNeoInput = {
  _id?: InputMaybe<Scalars["ID"]>;
};

export enum RecalculateEnum {
  All = "All",
  Member = "Member",
  ProjectRole = "ProjectRole",
}

export type RejectionLetterInput = {
  message?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type RejectionLetterOutput = {
  __typename?: "rejectionLetterOutput";
  generatedLetter?: Maybe<Scalars["String"]>;
};

export type RelatedNodeInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  relatedNode_id?: InputMaybe<Scalars["ID"]>;
};

export type RelatedNode_NameInput = {
  connection?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  relatedNode_name?: InputMaybe<Scalars["String"]>;
  weight?: InputMaybe<Scalars["String"]>;
};

export type RelatedNodesTreeInput = {
  nodeID?: InputMaybe<Scalars["ID"]>;
  relatedScore?: InputMaybe<Scalars["Float"]>;
};

export type RelatedSkillsInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  relatedSkills_id?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type Reply = {
  receiver?: InputMaybe<Scalars["Boolean"]>;
  sender?: InputMaybe<Scalars["Boolean"]>;
};

export type ReplyType = {
  __typename?: "replyType";
  receiver?: Maybe<Scalars["Boolean"]>;
  sender?: Maybe<Scalars["Boolean"]>;
};

export type ReportPassFailType = {
  __typename?: "reportPassFailType";
  IDb?: Maybe<Scalars["String"]>;
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
};

export type ReportPassFailType2 = {
  __typename?: "reportPassFailType2";
  IDb?: Maybe<Scalars["String"]>;
  categoryName?: Maybe<Scalars["String"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
};

export type ReqVarsActionInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type ReqVarsStateInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type ReqVarsStateType = {
  __typename?: "reqVarsStateType";
  positionIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type RequestActionConversationInput = {
  reqVars?: InputMaybe<ReqVarsActionInput>;
  typeAction?: InputMaybe<TypeActionConvEnum>;
};

export type ResourcesInput = {
  name?: InputMaybe<Scalars["String"]>;
  url?: InputMaybe<Scalars["String"]>;
};

export type ResourcesType = {
  __typename?: "resourcesType";
  name?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
};

export type RespondToQueryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  conversationID?: InputMaybe<Scalars["ID"]>;
};

export type ResponderType = {
  __typename?: "responderType";
  positionID?: Maybe<Scalars["String"]>;
  userID?: Maybe<Scalars["String"]>;
};

export enum ResultEnum {
  Successful = "successful",
  Unsuccesful = "unsuccesful",
}

export type ReviewNode = {
  __typename?: "reviewNode";
  confidence?: Maybe<Scalars["Float"]>;
  node?: Maybe<Node>;
};

export type ReviewSummaryType = {
  __typename?: "reviewSummaryType";
  averageStars?: Maybe<Scalars["Float"]>;
  mainNodes?: Maybe<Array<Maybe<EndorseNode>>>;
  numberReview?: Maybe<Scalars["Int"]>;
  reviewers?: Maybe<Array<Maybe<MembersSmallType>>>;
  summary?: Maybe<Scalars["String"]>;
  totalIncome?: Maybe<Scalars["Float"]>;
};

export enum RoleEnum {
  Assistant = "assistant",
  User = "user",
}

export type RoleInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  archive?: InputMaybe<Scalars["Boolean"]>;
  benefits?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  budget?: InputMaybe<BudgetInput>;
  dateRangeEnd?: InputMaybe<Scalars["String"]>;
  dateRangeStart?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  expectations?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  hoursPerWeek?: InputMaybe<Scalars["Int"]>;
  keyResponsibilities?: InputMaybe<Scalars["String"]>;
  openPositions?: InputMaybe<Scalars["Int"]>;
  ratePerHour?: InputMaybe<Scalars["Int"]>;
  shortDescription?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<Array<InputMaybe<SkillRoleInput>>>;
  title?: InputMaybe<Scalars["String"]>;
};

export type RoleType = {
  __typename?: "roleType";
  _id?: Maybe<Scalars["ID"]>;
  archive?: Maybe<Scalars["Boolean"]>;
  benefits?: Maybe<Array<Maybe<Scalars["String"]>>>;
  budget?: Maybe<BudgetType>;
  dateRangeEnd?: Maybe<Scalars["String"]>;
  dateRangeStart?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  expectations?: Maybe<Array<Maybe<Scalars["String"]>>>;
  hoursPerWeek?: Maybe<Scalars["Int"]>;
  keyResponsibilities?: Maybe<Scalars["String"]>;
  nodes?: Maybe<Array<Maybe<NodesType>>>;
  openPositions?: Maybe<Scalars["Int"]>;
  ratePerHour?: Maybe<Scalars["Int"]>;
  shortDescription?: Maybe<Scalars["String"]>;
  skills?: Maybe<Array<Maybe<SkillRoleType>>>;
  title?: Maybe<Scalars["String"]>;
};

export enum RunAutoEnum {
  Member = "MEMBER",
  Position = "POSITION",
}

export type SaveActionsPerformedInput = {
  actionType?: InputMaybe<ActionTypeEnum>;
};

export type SaveCVtoUserInput = {
  cvContent?: InputMaybe<Scalars["String"]>;
  cvFilename?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type SaveCVtoUserOutput = {
  __typename?: "saveCVtoUserOutput";
  cvSummary?: Maybe<Scalars["String"]>;
  experienceAreas?: Maybe<Scalars["String"]>;
  growthAreas?: Maybe<Scalars["String"]>;
  improvementPoints?: Maybe<Scalars["String"]>;
  mainSkills?: Maybe<Array<Maybe<Scalars["String"]>>>;
  matchPercentage?: Maybe<Scalars["Float"]>;
  strongFit?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
  titleRole?: Maybe<Scalars["String"]>;
};

export type SaveCoreProductFeatureInterationInput = {
  buttonClicked: ExploreFeatureEnum;
};

export type SaveDailyLoginInput = {
  loginDate?: InputMaybe<Scalars["String"]>;
};

export type ScoreCardCategoryMemoryType = {
  __typename?: "scoreCardCategoryMemoryType";
  _id?: Maybe<Scalars["ID"]>;
  category?: Maybe<TypeCardMemoryEnum>;
  priority?: Maybe<Scalars["Float"]>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
  scoreCardsPosition?: Maybe<Array<Maybe<ScoreCardsPositionType>>>;
};

export type ScoreCardMemory = {
  __typename?: "scoreCardMemory";
  agent?: Maybe<Array<Maybe<AgentScoreCard>>>;
  overall?: Maybe<Scalars["Float"]>;
  reason?: Maybe<Scalars["String"]>;
};

export type ScoreCardMemoryInput = {
  agent?: InputMaybe<Array<InputMaybe<AgentScoreCardInput>>>;
  overall?: InputMaybe<Scalars["Float"]>;
  reason?: InputMaybe<Scalars["String"]>;
};

export type ScoreCardTotalType = {
  __typename?: "scoreCardTotalType";
  score?: Maybe<Scalars["Float"]>;
  scoreCardCalculated?: Maybe<Scalars["Boolean"]>;
};

export type ScoreCardsCandidateType = {
  __typename?: "scoreCardsCandidateType";
  card?: Maybe<CardMemory>;
  scoreAlignment?: Maybe<Scalars["Float"]>;
};

export type ScoreCardsPositionType = {
  __typename?: "scoreCardsPositionType";
  card?: Maybe<CardMemory>;
  reason?: Maybe<Scalars["String"]>;
  score?: Maybe<Scalars["Float"]>;
  scoreCardsCandidate?: Maybe<Array<Maybe<ScoreCardsCandidateType>>>;
};

export type SearchEden_V1Input = {
  conversationID?: InputMaybe<Scalars["ID"]>;
  memoriesType?: InputMaybe<MemoriesTypeEnum>;
  newMessage?: InputMaybe<Scalars["String"]>;
  newThread?: InputMaybe<Scalars["Boolean"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type SearchEden_V1Output = {
  __typename?: "searchEden_V1Output";
  reply?: Maybe<Scalars["String"]>;
  stateSearch?: Maybe<StateSearchType>;
};

export type SecondInterviewLetterInput = {
  message?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type SecondInterviewLetterOutput = {
  __typename?: "secondInterviewLetterOutput";
  generatedLetter?: Maybe<Scalars["String"]>;
};

export enum SendRespTypeEnum {
  Position = "POSITION",
  User = "USER",
}

export enum SenderRoleEnum {
  Assistant = "assistant",
  User = "user",
}

export type SenderType = {
  __typename?: "senderType";
  positionID?: Maybe<Scalars["String"]>;
  userID?: Maybe<Scalars["String"]>;
};

export enum ServerTypeEnum {
  Dao = "DAO",
  Hackathon = "Hackathon",
  Project = "Project",
}

export type ShowMembersConnectedToNodesInput = {
  cardMemoriesStructure?: InputMaybe<
    Array<InputMaybe<CardMemoriesStructureInput>>
  >;
  neighborNodeMaxSize?: InputMaybe<Scalars["Int"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  pageNumber?: InputMaybe<Scalars["Int"]>;
  pageSize?: InputMaybe<Scalars["Int"]>;
};

export type SkillInput_Member = {
  id?: InputMaybe<Scalars["ID"]>;
  level?: InputMaybe<LevelEnum>;
};

export type SkillRoleInput = {
  _id?: InputMaybe<Scalars["String"]>;
  comment?: InputMaybe<Scalars["String"]>;
  level?: InputMaybe<Scalars["String"]>;
  numEndorsement?: InputMaybe<Scalars["String"]>;
};

export type SkillRoleType = {
  __typename?: "skillRoleType";
  comment?: Maybe<Scalars["String"]>;
  level?: Maybe<Scalars["String"]>;
  numEndorsement?: Maybe<Scalars["String"]>;
  skillData?: Maybe<Skills>;
};

export type SkillType_Member = {
  __typename?: "skillType_member";
  author?: Maybe<Members>;
  level?: Maybe<LevelEnum>;
  skillInfo?: Maybe<Skills>;
};

export type SkillsAnalysisType = {
  __typename?: "skillsAnalysisType";
  content?: Maybe<Scalars["String"]>;
};

export type SkillsType = {
  __typename?: "skillsType";
  authors?: Maybe<Array<Maybe<Members>>>;
  id?: Maybe<Scalars["String"]>;
  points?: Maybe<Scalars["Float"]>;
};

export type SkillsTypeRole = {
  __typename?: "skillsTypeRole";
  skill?: Maybe<Scalars["String"]>;
};

export type SkillsUpdateMemberInput = {
  authors?: InputMaybe<Scalars["String"]>;
  communityLevel?: InputMaybe<Scalars["Float"]>;
  selfEndorsedLevel?: InputMaybe<Scalars["Float"]>;
  skillID?: InputMaybe<Scalars["ID"]>;
};

export type Skills_AutocompleteInput = {
  search?: InputMaybe<Scalars["String"]>;
};

export type SocialsInput = {
  custom?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  github?: InputMaybe<Scalars["String"]>;
  lens?: InputMaybe<Scalars["String"]>;
  linkedin?: InputMaybe<Scalars["String"]>;
  portfolio?: InputMaybe<Scalars["String"]>;
  telegram?: InputMaybe<Scalars["String"]>;
  twitter?: InputMaybe<Scalars["String"]>;
};

export type SocialsType = {
  __typename?: "socialsType";
  custom?: Maybe<Array<Maybe<Scalars["String"]>>>;
  github?: Maybe<Scalars["String"]>;
  lens?: Maybe<Scalars["String"]>;
  linkedin?: Maybe<Scalars["String"]>;
  portfolio?: Maybe<Scalars["String"]>;
  telegram?: Maybe<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
};

export type StateChangeConversationInput = {
  reqVars?: InputMaybe<ReqVarsStateInput>;
  typeState?: InputMaybe<TypeStateConvEnum>;
};

export type StateConversationType = {
  __typename?: "stateConversationType";
  reqVars?: Maybe<ReqVarsStateType>;
  typeState?: Maybe<TypeStateConvEnum>;
};

export type StateEdenChatType = {
  __typename?: "stateEdenChatType";
  categoryChat?: Maybe<CategoryQueryResponseEnum>;
  positionIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export enum StateEnum {
  Approved = "approved",
  Rejected = "rejected",
  Waiting = "waiting",
}

export enum StateSearchEnum {
  Found = "FOUND",
  NotFound = "NOT_FOUND",
  Searching = "SEARCHING",
}

export type StateSearchType = {
  __typename?: "stateSearchType";
  currentState?: Maybe<StateSearchEnum>;
  memories?: Maybe<Array<Maybe<MemoryStateType>>>;
};

export type StatsInput = {
  endDate?: InputMaybe<Scalars["Date"]>;
  range?: InputMaybe<Range>;
  startDate?: InputMaybe<Scalars["Date"]>;
};

export type StoreLongTermMemoryInput = {
  messages?: InputMaybe<Array<InputMaybe<MessageInp>>>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type StoreLongTermMemoryOutput = {
  __typename?: "storeLongTermMemoryOutput";
  success?: Maybe<Scalars["Boolean"]>;
  summary?: Maybe<Scalars["String"]>;
};

export type StoreLongTermMemorySummaryInput = {
  message?: InputMaybe<Scalars["String"]>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type StoreLongTermMemorySummaryOutput = {
  __typename?: "storeLongTermMemorySummaryOutput";
  message?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type StyleEdgeIn = {
  color?: InputMaybe<Scalars["String"]>;
  distance?: InputMaybe<Scalars["Float"]>;
  strength?: InputMaybe<Scalars["Float"]>;
};

export type SubjectConvType = {
  __typename?: "subjectConvType";
  companyIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  positionIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  userIDs?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type SubjectConversationInput = {
  companyIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  userIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type SubmitCandidatePositionInput = {
  candidateID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type SubscribeToCommunityInput = {
  communityID?: InputMaybe<Scalars["ID"]>;
  companyID?: InputMaybe<Scalars["ID"]>;
};

export type SummariesMessagesType = {
  __typename?: "summariesMessagesType";
  content?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["Date"]>;
  pineConeID?: Maybe<Scalars["String"]>;
};

export type SummaryType = {
  __typename?: "summaryType";
  content?: Maybe<Scalars["String"]>;
  pineConeID?: Maybe<Scalars["String"]>;
};

export type TalentListType = {
  __typename?: "talentListType";
  _id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  positionID?: Maybe<Scalars["ID"]>;
  talent?: Maybe<Array<Maybe<TalentType>>>;
};

export type TalentType = {
  __typename?: "talentType";
  user?: Maybe<Members>;
};

export type TalkToEdenGeneral_V1Input = {
  infoConv?: InputMaybe<ConversationInfoInput>;
  message?: InputMaybe<Scalars["String"]>;
  requestAction?: InputMaybe<RequestActionConversationInput>;
  stateChange?: InputMaybe<StateChangeConversationInput>;
};

export type TalkToEdenGeneral_V1Output = {
  __typename?: "talkToEdenGeneral_V1Output";
  chatResp?: Maybe<Array<Maybe<ChatRespType>>>;
  state?: Maybe<StateConversationType>;
};

export type TeamInput = {
  memberID?: InputMaybe<Scalars["String"]>;
  phase?: InputMaybe<PhaseType>;
  roleID?: InputMaybe<Scalars["String"]>;
};

export type TeamType = {
  __typename?: "teamType";
  memberInfo?: Maybe<Members>;
  phase?: Maybe<PhaseType>;
  roleID?: Maybe<Scalars["String"]>;
};

export type TeamsType = {
  __typename?: "teamsType";
  announcement?: Maybe<Array<Maybe<ProjectUpdate>>>;
  teamData?: Maybe<Team>;
};

export type TeamsType_Garden = {
  __typename?: "teamsType_garden";
  role?: Maybe<Array<Maybe<RoleType_Garden>>>;
  teamData?: Maybe<Team>;
};

export type TextToPrimitivesAndTalentInput = {
  neighborNodeMaxSize?: InputMaybe<Scalars["Int"]>;
  pageNumber?: InputMaybe<Scalars["Int"]>;
  pageSize?: InputMaybe<Scalars["Int"]>;
  scoreCardMaxSize?: InputMaybe<Scalars["Int"]>;
  text?: InputMaybe<Scalars["String"]>;
};

export type TotalNodeTrustType = {
  __typename?: "totalNodeTrustType";
  averageTrustNum?: Maybe<Scalars["Float"]>;
  numberOfTrustNodes?: Maybe<Scalars["Int"]>;
  totalTrustNum?: Maybe<Scalars["Float"]>;
};

export type TradeOffsInput = {
  selected?: InputMaybe<Scalars["String"]>;
  tradeOff1?: InputMaybe<Scalars["String"]>;
  tradeOff2?: InputMaybe<Scalars["String"]>;
};

export type TradeOffsType = {
  __typename?: "tradeOffsType";
  reason?: Maybe<Scalars["String"]>;
  selected?: Maybe<Scalars["String"]>;
  tradeOff1?: Maybe<Scalars["String"]>;
  tradeOff2?: Maybe<Scalars["String"]>;
};

export type TranscribeAudioToTextInput = {
  audioFile?: InputMaybe<Scalars["Upload"]>;
};

export type TranscribeAudioToTextOutput = {
  __typename?: "transcribeAudioToTextOutput";
  transcription?: Maybe<Scalars["String"]>;
};

export type TreeOfRelatedNodesInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
  relatedNodes?: InputMaybe<Array<InputMaybe<RelatedNodesTreeInput>>>;
};

export type TweetsInput = {
  author?: InputMaybe<Scalars["String"]>;
  content?: InputMaybe<Scalars["String"]>;
};

export type TweetsProject = {
  __typename?: "tweetsProject";
  newTweetID?: Maybe<Scalars["ID"]>;
  numTweets?: Maybe<Scalars["Int"]>;
  tweets?: Maybe<Array<Maybe<TweetsType>>>;
};

export type TweetsType = {
  __typename?: "tweetsType";
  _id?: Maybe<Scalars["ID"]>;
  approved?: Maybe<Scalars["Boolean"]>;
  author?: Maybe<Members>;
  content?: Maybe<Scalars["String"]>;
  registeredAt?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
};

export enum TypeActionConvEnum {
  FindNewPosition = "FIND_NEW_POSITION",
}

export enum TypeCardMemoryEnum {
  Behavior = "BEHAVIOR",
  CoreValues = "CORE_VALUES",
  DomainExpertise = "DOMAIN_EXPERTISE",
  Education = "EDUCATION",
  Experience = "EXPERIENCE",
  Goals = "GOALS",
  IndustryKnowledge = "INDUSTRY_KNOWLEDGE",
  Interests = "INTERESTS",
  Other = "OTHER",
  SoftSkills = "SOFT_SKILLS",
  TechnicalSkills = "TECHNICAL_SKILLS",
}

export enum TypeCompany {
  Community = "COMMUNITY",
  Company = "COMPANY",
}

export enum TypeConversationEnum {
  AlignmentPosition = "ALIGNMENT_POSITION",
  AskOpportunity = "ASK_OPPORTUNITY",
  Interview = "INTERVIEW",
  PromoteCandidate = "PROMOTE_CANDIDATE",
}

export enum TypeConvoEnum {
  Align = "ALIGN",
  AskCandidate = "ASK_CANDIDATE",
  AskOpportunity = "ASK_OPPORTUNITY",
  AskTalentList = "ASK_TALENT_LIST",
  Interview = "INTERVIEW",
  QueryResponse = "QUERY_RESPONSE",
}

export enum TypeEnumMp {
  Member = "Member",
  ProjectRole = "ProjectRole",
}

export enum TypeStateConvEnum {
  FindNewPosition = "FIND_NEW_POSITION",
}

export type UnansweredQuestionsInput = {
  questionContent?: InputMaybe<Scalars["String"]>;
  questionID?: InputMaybe<Scalars["ID"]>;
};

export type UnansweredQuestionsType = {
  __typename?: "unansweredQuestionsType";
  questionContent?: Maybe<Scalars["String"]>;
  questionID?: Maybe<Scalars["ID"]>;
};

export type UpdateAnalysisEdenAiCandidatesInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateChatReplyInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  receiverReply: Scalars["Boolean"];
  replyUserID?: InputMaybe<Scalars["ID"]>;
  threadID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateChatResultInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  result?: InputMaybe<ResultEnum>;
  threadID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateCompanyDetailsInput = {
  benefits?: InputMaybe<Scalars["String"]>;
  culture?: InputMaybe<CompanyCultureTypeInput>;
  description?: InputMaybe<Scalars["String"]>;
  edenTake?: InputMaybe<Scalars["String"]>;
  employeesNumber?: InputMaybe<Scalars["Int"]>;
  founders?: InputMaybe<Scalars["String"]>;
  funding?: InputMaybe<Array<InputMaybe<CompanyFoundRoundTypeInput>>>;
  glassdoor?: InputMaybe<Scalars["String"]>;
  imageUrl?: InputMaybe<Scalars["String"]>;
  insights?: InputMaybe<Array<InputMaybe<CompanyInsightTypeInput>>>;
  mission?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  values?: InputMaybe<Scalars["String"]>;
  whatsToLove?: InputMaybe<Scalars["String"]>;
};

export type UpdateCompanyInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  addCompanySubscribersID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  addPositionSubscribersID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  approvedEmails?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  communitiesSubscribedID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  slug?: InputMaybe<Scalars["String"]>;
  type?: InputMaybe<TypeCompany>;
};

export type UpdateConvSummariesInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  convKey?: InputMaybe<Scalars["String"]>;
};

export type UpdateConversationInput = {
  conversation?: InputMaybe<Array<InputMaybe<ConversationInput>>>;
  conversationID?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["String"]>;
  questionAskingID?: InputMaybe<Scalars["ID"]>;
  questionAskingNow?: InputMaybe<Scalars["String"]>;
  timesAsked?: InputMaybe<Scalars["Int"]>;
  userID?: InputMaybe<Scalars["String"]>;
};

export type UpdateGrantInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  amount?: InputMaybe<Scalars["String"]>;
  applicationProcess?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  avatar?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["String"]>;
  difficulty?: InputMaybe<Scalars["String"]>;
  distributed?: InputMaybe<Scalars["Int"]>;
  maxDistributed?: InputMaybe<Scalars["Int"]>;
  name?: InputMaybe<Scalars["String"]>;
  requirments?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  resources?: InputMaybe<Array<InputMaybe<ResourcesInput>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  smallDescription?: InputMaybe<Scalars["String"]>;
  tags?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type UpdateMemberInRoomInput = {
  bio?: InputMaybe<Scalars["String"]>;
  content?: InputMaybe<ContentInput>;
  discordAvatar?: InputMaybe<Scalars["String"]>;
  discordName?: InputMaybe<Scalars["String"]>;
  discriminator?: InputMaybe<Scalars["String"]>;
  hoursPerWeek?: InputMaybe<Scalars["Float"]>;
  interest?: InputMaybe<Scalars["String"]>;
  links?: InputMaybe<Array<InputMaybe<LinkInput>>>;
  memberID?: InputMaybe<Scalars["ID"]>;
  memberRole?: InputMaybe<FindRoleTemplateInput>;
  onbording?: InputMaybe<OnboardingInput>;
  previousProjects?: InputMaybe<Array<InputMaybe<PreviousProjectsInput>>>;
  roomID?: InputMaybe<Scalars["ID"]>;
  serverID?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<Array<InputMaybe<SkillInput_Member>>>;
  timeZone?: InputMaybe<Scalars["String"]>;
};

export type UpdateMemberInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  bio?: InputMaybe<Scalars["String"]>;
  budget?: InputMaybe<BudgetInputTk>;
  companies?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  conduct?: InputMaybe<ConductInput>;
  content?: InputMaybe<ContentInput>;
  discordAvatar?: InputMaybe<Scalars["String"]>;
  discordName?: InputMaybe<Scalars["String"]>;
  discriminator?: InputMaybe<Scalars["String"]>;
  experienceLevel?: InputMaybe<ExperienceLevelInput>;
  hoursPerWeek?: InputMaybe<Scalars["Float"]>;
  interest?: InputMaybe<Scalars["String"]>;
  links?: InputMaybe<Array<InputMaybe<LinkInput>>>;
  location?: InputMaybe<Scalars["String"]>;
  memberRole?: InputMaybe<Scalars["ID"]>;
  onbording?: InputMaybe<OnboardingInput>;
  previousProjects?: InputMaybe<Array<InputMaybe<PreviousProjectsInput>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  skills?: InputMaybe<Array<InputMaybe<SkillInput_Member>>>;
  timeZone?: InputMaybe<Scalars["String"]>;
};

export type UpdateMemberSignalInfoInput = {
  completedOpportunities?: InputMaybe<Scalars["Int"]>;
  hoursPerWeek?: InputMaybe<Scalars["Int"]>;
  location?: InputMaybe<Scalars["String"]>;
  memberID?: InputMaybe<Scalars["ID"]>;
  timeZone?: InputMaybe<Scalars["String"]>;
  totalIncome?: InputMaybe<Scalars["Float"]>;
};

export type UpdateMessageInput = {
  edenAI?: InputMaybe<EdenAiInput>;
  messageID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateNodesToGrantInput = {
  grantID?: InputMaybe<Scalars["ID"]>;
  nodeType?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  nodesID_level?: InputMaybe<Array<InputMaybe<NodesId_LevelInput>>>;
};

export type UpdateNodesToMemberInRoomInput = {
  nodeType?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  nodesID_level?: InputMaybe<Array<InputMaybe<NodesId_LevelInput>>>;
  roomID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateNodesToMemberInput = {
  nodeType?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  nodesID_level?: InputMaybe<Array<InputMaybe<NodesId_LevelInput>>>;
};

export type UpdateNodesToMemberMultiTypeNodeInput = {
  nodeType?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type UpdateNodesToProjectRoleInput = {
  nodeType?: InputMaybe<Scalars["String"]>;
  nodesID?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  projectRoleID?: InputMaybe<Scalars["ID"]>;
};

export type UpdatePositionConvRecruiterInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type UpdatePositionGeneralDetailsInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  contractDuration?: InputMaybe<Scalars["String"]>;
  contractType?: InputMaybe<Scalars["String"]>;
  officeLocation?: InputMaybe<Scalars["String"]>;
  officePolicy?: InputMaybe<Scalars["String"]>;
  socials?: InputMaybe<SocialsInput>;
  startDate?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PositionStatus>;
  visaRequired?: InputMaybe<Scalars["Boolean"]>;
  yearlySalary?: InputMaybe<YearlySalaryInput>;
};

export type UpdatePositionInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  companyID?: InputMaybe<Scalars["ID"]>;
  conduct?: InputMaybe<ConductInput>;
  icon?: InputMaybe<Scalars["String"]>;
  mainUserID?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  status?: InputMaybe<PositionStatus>;
  updatePosition?: InputMaybe<Scalars["ID"]>;
  whatTheJobInvolves?: InputMaybe<Scalars["String"]>;
  whatsToLove?: InputMaybe<Scalars["String"]>;
  whoYouAre?: InputMaybe<Scalars["String"]>;
};

export type UpdatePositionUserAnswersInput = {
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type UpdatePrioritiesTradeOffsInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  priorities?: InputMaybe<Array<InputMaybe<PrioritiesInput>>>;
  tradeOffs?: InputMaybe<Array<InputMaybe<TradeOffsInput>>>;
};

export type UpdatePrioritiesTradeOffsOutput = {
  __typename?: "updatePrioritiesTradeOffsOutput";
  priorities?: Maybe<Array<Maybe<PrioritiesType>>>;
  success?: Maybe<Scalars["Boolean"]>;
  tradeOffs?: Maybe<Array<Maybe<TradeOffsType>>>;
};

export type UpdateProjectInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  backColorEmoji?: InputMaybe<Scalars["String"]>;
  budget?: InputMaybe<BudgetInput>;
  collaborationLinks?: InputMaybe<Array<InputMaybe<CollaborationLinksInput>>>;
  dates?: InputMaybe<DatesInput>;
  description?: InputMaybe<Scalars["String"]>;
  descriptionOneLine?: InputMaybe<Scalars["String"]>;
  emoji?: InputMaybe<Scalars["String"]>;
  gardenServerID?: InputMaybe<Scalars["String"]>;
  role?: InputMaybe<Array<InputMaybe<RoleInput>>>;
  serverID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  stepsJoinProject?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  team?: InputMaybe<Array<InputMaybe<TeamInput>>>;
  title?: InputMaybe<Scalars["String"]>;
};

export type UpdateQueryResponseInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  answer?: InputMaybe<Scalars["String"]>;
  category?: InputMaybe<CategoryQueryResponseEnum>;
  conversationID?: InputMaybe<Scalars["ID"]>;
  phase?: InputMaybe<PhaseQueryResponseEnum>;
  question?: InputMaybe<Scalars["String"]>;
  responderID?: InputMaybe<Scalars["ID"]>;
  responderType?: InputMaybe<SendRespTypeEnum>;
  scheduleInterviewUrl?: InputMaybe<Scalars["String"]>;
  senderID?: InputMaybe<Scalars["ID"]>;
  senderType?: InputMaybe<SendRespTypeEnum>;
  sentFlag?: InputMaybe<Scalars["Boolean"]>;
};

export type UpdateServerInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  adminCommands?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  adminID?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  adminRoles?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  channelChatID?: InputMaybe<Scalars["ID"]>;
  forumChatID?: InputMaybe<Scalars["ID"]>;
  name?: InputMaybe<Scalars["String"]>;
  serverAvatar?: InputMaybe<Scalars["String"]>;
  serverType?: InputMaybe<ServerTypeEnum>;
};

export type UpdateSkillCategoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  description?: InputMaybe<Scalars["String"]>;
  emoji?: InputMaybe<Scalars["String"]>;
  id_lightcast?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  subCategorySkill?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type UpdateSkillSubCategoryInput = {
  _id?: InputMaybe<Scalars["ID"]>;
  categorySkills?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  description?: InputMaybe<Scalars["String"]>;
  emoji?: InputMaybe<Scalars["String"]>;
  id_lightcast?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  skills?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

export type UpdateStateEdenChatInput = {
  categoryChat?: InputMaybe<CategoryQueryResponseEnum>;
  chatID_TG?: InputMaybe<Scalars["ID"]>;
  positionIDs?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
  userID?: InputMaybe<Scalars["ID"]>;
};

export type UpdateTgOutput = {
  __typename?: "updateTGOutput";
  _id?: Maybe<Scalars["ID"]>;
  authTelegramCode?: Maybe<Scalars["String"]>;
  done?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  telegram?: Maybe<Scalars["String"]>;
  telegramChatID?: Maybe<Scalars["String"]>;
};

export type UpdateUrlInput = {
  companyID?: InputMaybe<Scalars["ID"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
  url?: InputMaybe<Scalars["String"]>;
};

export type UpdateUsersTalentListPositionInput = {
  positionID?: InputMaybe<Scalars["ID"]>;
  talentListID?: InputMaybe<Scalars["ID"]>;
  usersTalentList?: InputMaybe<Array<InputMaybe<Scalars["ID"]>>>;
};

export type UploadUserDataGptInput = {
  memberID?: InputMaybe<Scalars["ID"]>;
};

export type UseAi_OnMessageInput = {
  cash?: InputMaybe<Scalars["Boolean"]>;
  message?: InputMaybe<Scalars["String"]>;
  numberKeywords?: InputMaybe<Scalars["Float"]>;
};

export type UseAi_OnMessageOutput = {
  __typename?: "useAI_OnMessageOutput";
  expertiseIdentified?: Maybe<Array<Maybe<Scalars["String"]>>>;
  keywordsMessage?: Maybe<Array<Maybe<Scalars["String"]>>>;
  mainExpertise?: Maybe<Scalars["String"]>;
};

export type WebsiteToMemoryCompanyInput = {
  message?: InputMaybe<Scalars["String"]>;
  positionID?: InputMaybe<Scalars["ID"]>;
};

export type WebsiteToMemoryCompanyOutput = {
  __typename?: "websiteToMemoryCompanyOutput";
  interviewQuestionsForPosition?: Maybe<
    Array<Maybe<InterviewQuestionsForCandidateType>>
  >;
  nodes?: Maybe<Array<Maybe<Node>>>;
  report?: Maybe<Scalars["String"]>;
  success?: Maybe<Scalars["Boolean"]>;
};

export type WeightModulesInput = {
  type?: InputMaybe<Scalars["String"]>;
  weight?: InputMaybe<Scalars["Int"]>;
};

export type WeightSeparateType = {
  __typename?: "weightSeparateType";
  hopNum?: Maybe<Scalars["Int"]>;
  node?: Maybe<Node>;
  weight?: Maybe<Scalars["Float"]>;
};

export type Wh_K_ArrType = {
  __typename?: "wh_k_arrType";
  numPath?: Maybe<Scalars["Float"]>;
  wh_sum?: Maybe<Scalars["Float"]>;
};

export enum WhatToAskEnum {
  AllCandidatesOfCompany = "ALL_CANDIDATES_OF_COMPANY",
  CandidateOfCompany = "CANDIDATE_OF_COMPANY",
  Company = "COMPANY",
}

export type WhatsAppInput = {
  body?: InputMaybe<Scalars["String"]>;
  from?: InputMaybe<Scalars["String"]>;
  to?: InputMaybe<Scalars["String"]>;
};

export enum WidgetTypeEnum {
  AddState = "ADD_STATE",
  IndividualMemories = "INDIVIDUAL_MEMORIES",
  Message = "MESSAGE",
  Scorecard = "SCORECARD",
}

export type WidgetVarsType = {
  __typename?: "widgetVarsType";
  memories?: Maybe<Array<Maybe<CardMemory>>>;
  memory?: Maybe<MemoryStateType>;
};

export type YearlySalaryInput = {
  max?: InputMaybe<Scalars["Int"]>;
  min?: InputMaybe<Scalars["Int"]>;
};

export type YearlySalaryType = {
  __typename?: "yearlySalaryType";
  max?: Maybe<Scalars["Int"]>;
  min?: Maybe<Scalars["Int"]>;
};

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {},
};
export default result;
