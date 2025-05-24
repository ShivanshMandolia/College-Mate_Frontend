import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Grid,
  Container,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  useGetAllEventsQuery
} from '../../features/events/eventsApiSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

// College Mate Theme
const collegeMateTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9333ea', // purple-600
      light: '#c084fc', // purple-400
      dark: '#7c3aed', // purple-700
    },
    secondary: {
      main: '#db2777', // pink-600
      light: '#f472b6', // pink-400
    },
    info: {
      main: '#4f46e5', // indigo-600
      light: '#818cf8', // indigo-400
    },
    background: {
      default: '#0f172a', // slate-900
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cbd5e1', // slate-300
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '24px',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            background: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(147, 51, 234, 0.50)',
            boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.10)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05) translateY(-2px)',
            boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.25)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            borderRadius: '16px',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.08)',
            },
            '&.Mui-focused': {
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(147, 51, 234, 0.50)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          borderRadius: '16px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          borderRadius: '12px',
          color: '#ffffff',
          '&.MuiChip-colorSuccess': {
            background: 'linear-gradient(135deg, #10b981, #059669)',
          },
          '&.MuiChip-colorWarning': {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          },
          '&.MuiChip-colorError': {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #9333ea, #db2777)',
          fontWeight: 700,
          fontSize: '1.2rem',
        },
      },
    },
  },
});

// Styled Components
const PageContainer = styled(Container)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)',
  minHeight: '100vh',
  position: 'relative',
  paddingTop: '32px',
  paddingBottom: '32px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.10) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative',
  zIndex: 1,
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #c084fc, #f472b6, #818cf8)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  fontWeight: 700,
}));

const SearchCard = styled(Card)(({ theme }) => ({
  padding: '32px',
  marginBottom: '32px',
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  '&:hover': {
    transform: 'none',
    background: 'rgba(255, 255, 255, 0.08)',
  },
}));

const EventCardStyled = styled(Card)(({ theme }) => ({
  height: 'fit-content',
  overflow: 'hidden',
  '& .MuiCardMedia-root': {
    borderRadius: '16px',
    margin: '16px',
    marginBottom: 0,
  },
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  background: 'linear-gradient(135deg, #9333ea, #db2777)',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  boxShadow: '0 10px 25px -5px rgba(147, 51, 234, 0.3)',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1) rotate(3deg)',
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  background: 'rgba(255, 255, 255, 0.10)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.15)',
    transform: !expand ? 'rotate(0deg) scale(1.1)' : 'rotate(180deg) scale(1.1)',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  '& .MuiCircularProgress-root': {
    background: 'linear-gradient(45deg, #9333ea, #db2777)',
    borderRadius: '50%',
    padding: '4px',
  },
}));

const StudentEventsPage = () => {
  const user = useSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());

  // RTK Query hooks
  const { data: eventsData, isLoading, error, refetch } = useGetAllEventsQuery();

  const events = eventsData?.data || [];

  // Filter and search events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const eventDate = new Date(event.date);
    const now = new Date();
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'upcoming' && eventDate > now) ||
      (filterType === 'past' && eventDate < now) ||
      (filterType === 'today' && eventDate.toDateString() === now.toDateString());

    return matchesSearch && matchesFilter;
  });

  // Toggle card expansion
  const handleExpandClick = (eventId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedCards(newExpanded);
  };

  // Toggle bookmark
  const toggleBookmark = (eventId) => {
    const newBookmarks = new Set(bookmarkedEvents);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
    } else {
      newBookmarks.add(eventId);
    }
    setBookmarkedEvents(newBookmarks);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  // Get event status
  const getEventStatus = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffHours = (event - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { status: 'past', color: 'default', text: 'Past Event' };
    if (diffHours < 24) return { status: 'today', color: 'error', text: 'Today' };
    if (diffHours < 72) return { status: 'soon', color: 'warning', text: 'Coming Soon' };
    return { status: 'upcoming', color: 'success', text: 'Upcoming' };
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={collegeMateTheme}>
        <PageContainer maxWidth="lg">
          <LoadingContainer>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">Loading events...</Typography>
          </LoadingContainer>
        </PageContainer>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={collegeMateTheme}>
        <PageContainer maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{
              background: 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
            }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {error?.data?.message || 'Failed to load events. Please try again.'}
          </Alert>
        </PageContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={collegeMateTheme}>
      <PageContainer maxWidth="100%">
        {/* Hero Section */}
        <HeroSection>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <FloatingIcon>
              <EventIcon sx={{ fontSize: 32, color: 'white' }} />
            </FloatingIcon>
            <Box>
              <GradientText variant="h3" component="h1">
                Campus Events
              </GradientText>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                Discover and participate in exciting campus activities
              </Typography>
            </Box>
          </Box>
        </HeroSection>

        {/* Search and Filters */}
        <SearchCard>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#c084fc' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#cbd5e1' }}>Filter Events</InputLabel>
                <Select
                  value={filterType}
                  label="Filter Events"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="past">Past Events</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </SearchCard>

        {/* Events Grid */}
        <Grid container spacing={3}>
          {filteredEvents.map((event) => {
            const dateInfo = formatDate(event.date);
            const eventStatus = getEventStatus(event.date);
            const isExpanded = expandedCards.has(event._id);
            const isBookmarked = bookmarkedEvents.has(event._id);

            return (
              <Grid item xs={12} md={4} key={event._id}>
                <EventCard
                  event={event}
                  dateInfo={dateInfo}
                  eventStatus={eventStatus}
                  isExpanded={isExpanded}
                  isBookmarked={isBookmarked}
                  onExpandClick={() => handleExpandClick(event._id)}
                  onToggleBookmark={() => toggleBookmark(event._id)}
                  user={user}
                />
              </Grid>
            );
          })}
        </Grid>

        {filteredEvents.length === 0 && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                background: 'linear-gradient(135deg, #9333ea, #db2777)',
                borderRadius: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                opacity: 0.6,
              }}
            >
              <CalendarIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No events found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}
      </PageContainer>
    </ThemeProvider>
  );
};

// Event Card Component
const EventCard = ({ 
  event, 
  dateInfo, 
  eventStatus, 
  isExpanded, 
  isBookmarked, 
  onExpandClick, 
  onToggleBookmark, 
  user 
}) => {
  return (
    <EventCardStyled>
      <CardHeader
        avatar={
          <Avatar sx={{ 
            width: 56, 
            height: 56,
            fontSize: '1.4rem',
            fontWeight: 700,
          }}>
            {dateInfo.day}
          </Avatar>
        }
        action={
          user && (
            <IconButton 
              onClick={onToggleBookmark} 
              sx={{
                background: isBookmarked 
                  ? 'linear-gradient(135deg, #facc15, #f59e0b)' 
                  : 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                '&:hover': {
                  background: isBookmarked 
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                    : 'rgba(255, 255, 255, 0.15)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          )
        }
        title={
          <Typography variant="h6" component="div" fontWeight={700} sx={{ mb: 1 }}>
            {event.title}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              icon={<TimeIcon />} 
              label={dateInfo.time} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={eventStatus.text} 
              size="small" 
              color={eventStatus.color}
            />
          </Box>
        }
      />
      
      {event.image && (
        <CardMedia
          component="img"
          height="200"
          image={event.image}
          alt={event.title}
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop`;
          }}
        />
      )}

      <CardActions disableSpacing sx={{ px: 2 }}>
        <IconButton
          sx={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              transform: 'scale(1.1)',
            },
          }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: event.title,
                text: event.description,
                url: window.location.href
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
        >
          <ShareIcon />
        </IconButton>

        <ExpandMore
          expand={isExpanded}
          onClick={onExpandClick}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
            Event Details
          </Typography>
          
          <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
            {event.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}>
              <CalendarIcon sx={{ color: '#c084fc' }} />
              <Typography variant="body2" fontWeight={500}>
                {dateInfo.full}
              </Typography>
            </Box>

            {event.location && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}>
                <LocationIcon sx={{ color: '#818cf8' }} />
                <Typography variant="body2" fontWeight={500}>
                  {event.location}
                </Typography>
              </Box>
            )}

            {event.expectedAttendees && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}>
                <PeopleIcon sx={{ color: '#60a5fa' }} />
                <Typography variant="body2" fontWeight={500}>
                  Expected: {event.expectedAttendees}+ attendees
                </Typography>
              </Box>
            )}

            {event.organizer && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}>
                <EventIcon sx={{ color: '#f472b6' }} />
                <Typography variant="body2" fontWeight={500}>
                  Organized by: {event.organizer}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </EventCardStyled>
  );
};

export default StudentEventsPage;