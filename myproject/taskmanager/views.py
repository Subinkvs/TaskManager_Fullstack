from rest_framework.permissions import  IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TaskmanagerSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .models import TaskManager
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from .serializers import RegisterSerializer, LoginSerializer

class RegisterAPI(APIView):
    permission_classes = [AllowAny] 
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
      
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPI(APIView):
    permission_classes = [AllowAny]
     
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer._validated_data
            refresh = RefreshToken.for_user(user)
            
            if user is not None: 
                refresh = RefreshToken.for_user(user)  
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class TaskManagerPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaskMangerFilter(filters.FilterSet):
    status = filters.BooleanFilter(field_name = 'status')
    
    class Meta:
        model = TaskManager
        fields = ['status']

class TodoView(viewsets.ModelViewSet):
    serializer_class = TaskmanagerSerializer
    queryset =  TaskManager.objects.all().order_by('-created_at')
    pagination_class = TaskManagerPagination
    filter_backends = [SearchFilter, DjangoFilterBackend]
    filterset_class = TaskMangerFilter
    search_fields = ['title']
    permission_classes = [IsAuthenticated]