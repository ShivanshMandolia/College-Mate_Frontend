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
import { styled } from '@mui/material/styles';
import { 
  useGetAllEventsQuery
} from '../../features/events/eventsApiSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
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
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">Loading events...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {error?.data?.message || 'Failed to load events. Please try again.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EventIcon sx={{ fontSize: 30, color: 'primary.main', mr: 2 }} />
          <Typography variant="h3" component="h2" fontWeight="bold">
            Campus Events
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Discover and participate in exciting campus activities
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ p: 2, mb: 2 }}>
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
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter Events</InputLabel>
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
      </Card>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => {
          const dateInfo = formatDate(event.date);
          const eventStatus = getEventStatus(event.date);
          const isExpanded = expandedCards.has(event._id);
          const isBookmarked = bookmarkedEvents.has(event._id);

          return (
            <Grid item xs={9} md={4} key={event._id}>
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
          <CalendarIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No events found
          </Typography>
          <Typography color="text.secondary">
            Try adjusting your search terms or filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

// Event Card Component using Material-UI
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
    <Card sx={{ maxWidth: '100%', height: 'fit-content' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {dateInfo.day}
          </Avatar>
        }
        action={
          user && (
            <IconButton onClick={onToggleBookmark} color={isBookmarked ? 'warning' : 'default'}>
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          )
        }
        title={
          <Typography variant="h6" component="div" fontWeight="bold">
            {event.title}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
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

      <CardActions disableSpacing>
        <IconButton
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
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Event Details
          </Typography>
          
          <Typography paragraph color="text.secondary">
            {event.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="action" />
              <Typography variant="body2">
                {dateInfo.full}
              </Typography>
            </Box>

            {event.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon color="action" />
                <Typography variant="body2">
                  {event.location}
                </Typography>
              </Box>
            )}

            {event.expectedAttendees && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon color="action" />
                <Typography variant="body2">
                  Expected: {event.expectedAttendees}+ attendees
                </Typography>
              </Box>
            )}

            {event.organizer && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="action" />
                <Typography variant="body2">
                  Organized by: {event.organizer}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default StudentEventsPage;