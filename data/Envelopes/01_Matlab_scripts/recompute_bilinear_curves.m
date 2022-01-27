% Recompute bilinear approximations based on new envelope curves
% Katrin Beyer, Jan 27, 2022

clear all
close all
clc

folder_curves='../../Curves/'; % folder in which hysteretic curves are saved (to be read)
folder_new_envelopes='../'; % folder to which envelope curves will be written
folder_database='../../'; % folder that contains the xls-database

plot_figures=1 % 0: Do not plot figures with hystereses and envelopes; 1: Plot figures

%% Read database
filename_database = dir(fullfile(folder_database, '*.xls'))
[~,~,dat]=xlsread(strcat(folder_database,filename_database.name),'Database');
ID_vec=cell2mat([dat(2:end,1)]);
Ntests=nanmax(ID_vec);
FD_filenames=[dat(2:Ntests+1,66)];
ID_vec=cell2mat([dat(2:Ntests+1,1)]);
cyclic_vs_monotonic=[dat(2:end,5)];

for k=1:Ntests
    % Check whether it is a monotonic test
    if isempty(strfind(cyclic_vs_monotonic{k},'onotonic'))==0
        monotonic(k)=1;
    else
        monotonic(k)=0;
    end
end

% For comparison with newly computed values

du_pos_vec_DB=([dat(2:Ntests+1,40)]);
du_pos_vec_DB(strcmp(du_pos_vec_DB, 'NaN')) = {NaN};
du_pos_vec_DB=cell2mat(du_pos_vec_DB);

du_neg_vec_DB=([dat(2:Ntests+1,42)]);
du_neg_vec_DB(strcmp(du_neg_vec_DB, 'NaN')) = {NaN};
du_neg_vec_DB=cell2mat(du_neg_vec_DB);





%% Compute bilinear approximation
for k=1:2% Ntests

    filename=FD_filenames{k};

    % Compute bilinear approximation only for those tests for which a
    % hysteretic curve and hence an envelope curve is available
    if isempty(strfind(filename,'not available'))==1

        % Read hysteretic and envelope curve
        filename=FD_filenames{k};
        filename_with_folder=strcat([folder_curves, filename]);

        data=csvread(filename_with_folder,4,0);
        x1=data(:,1); % Displacement
        x2=data(:,3); % Drift
        y=data(:,2); % Force

        env_filename=strrep(filename,'FD','envelope');
        env_filename_with_folder=strcat(folder_new_envelopes,env_filename);
        data=csvread(env_filename_with_folder,4,0);
        x1_env=data(:,1); % Displacement
        x2_env=data(:,3); % Drift
        y_env=data(:,2); % Force

        if plot_figures==1
            figure('units','normalized','outerposition',[0 0 0.9 0.9])

            plot(x2,y,'b-'); hold on
            plot(x2_env,y_env,'gx-','linewidth',1.0); hold on
            xlabel('Drift'); ylabel('Force'); title(['Test ', num2str(k),': ',strrep(filename,'_','\_')]);
        end

        % Compute bilinear approximation following paper by Vanin et al.

        % First shift the displacement such that the curve passes through 0/0
        % Find how often the envelope curve moves from neg to pos

        N=find(x2_env(1:end-1).*x2_env(2:end)<=0)
        if length(N)>=1
            N=N(end);
            dx2_env=-y_env(N)/(y_env(N+1)-y_env(N))*(x2_env(N+1)-x2_env(N))+x2_env(N)
            dx1_env=-y_env(N)/(y_env(N+1)-y_env(N))*(x1_env(N+1)-x1_env(N))+x1_env(N)
        end
        x2_env=x2_env-dx2_env;
        x1_env=x1_env-dx1_env;

        % Add (0/0) to envelope curve
        x1_env(N+2:length(x1_env)+1)=x1_env(N+1:length(x1_env));
        x2_env(N+2:length(x2_env)+1)=x2_env(N+1:length(x2_env));
        y_env(N+2:length(y_env)+1)=y_env(N+1:length(y_env));
        x1_env(N+1)=0; x2_env(N+1)=0; y_env(N+1)=0;

        if plot_figures==1
            plot(x2_env,y_env,'rx-','linewidth',1.0); hold on
            grid on
        end

        % Define Vmax for the positive and the negative direction
        Vmax_pos=nanmax(y_env);
        Vmax_neg=nanmin(y_env);


        % Effective stiffness in pos direction
        ipeak=find(y_env==Vmax_pos);
        ipeak=ipeak(end);
        i1=max(find(y_env(1:ipeak)<=0.7*Vmax_pos))
        i2=min(find(y_env(i1+1:ipeak)>=0.7*Vmax_pos))+i1
        x2_0p7V=interp1(y_env(i1:i2),x2_env(i1:i2),0.7*Vmax_pos);
        keff_pos=0.7*Vmax_pos/x2_0p7V;

        % Ultimate positive drift
        i1=max(find(y_env(ipeak:end)>0.8*Vmax_pos))+ipeak-1
        i2=min(find(y_env(i1:end)<0.8*Vmax_pos))+i1-1
        i_zero=find(x2_env==0);

        if isempty(i2)==0;
            x2_ult_pos=interp1(y_env(i1:i2),x2_env(i1:i2),0.8*Vmax_pos);

            % Add interpolated point with x2_ult_pos
            N=i1;
            x2_env(N+2:length(x2_env)+1)=x2_env(N+1:length(x2_env));
            y_env(N+2:length(y_env)+1)=y_env(N+1:length(y_env));
            x2_mod(N+1)=x2_ult_pos; y_mod(N+1)=0.8*Vmax_pos;
            % Compute area below curve up to du_pos

            A_pos=trapz(x2_env(i_zero:i1+1),y_env(i_zero:i1+1));

        else % if 80% drop is not reached, take maximum drift
            x2_ult_pos=max(x2_env);
            % Compute area below curve up to du_pos

            A_pos=trapz(x2_env(i_zero:end),y_env(i_zero:end))
        end

        if         monotonic(k)==0

            % Effective stiffness in negative direction
            y_mod=-y_env(end:-1:1); x2_mod=-x2_env(end:-1:1);
            ipeak=find(y_mod==-Vmax_neg);
            ipeak=ipeak(end);
            i1=max(find(y_mod(1:ipeak)<0.7*(-Vmax_neg)))
            i2=min(find(y_mod(i1:ipeak)>0.7*(-Vmax_neg)))+i1-1
            y_env(i1)
            y_env(i2)
            x1_0p7V=interp1(y_mod(i1:i2),x2_mod(i1:i2),0.7*(-Vmax_neg));
            keff_neg=-0.7*Vmax_neg/x2_0p7V;

            i1=max(find(y_mod(ipeak:end)>-0.8*Vmax_neg))+ipeak-1
            i2=min(find(y_mod(i1:end)<-0.8*Vmax_neg))+i1-1
            i_zero=find(x2_mod==0);

            if isempty(i2)==0;
                x2_ult_neg=-interp1(y_mod(i1:i2),x2_mod(i1:i2),-0.8*Vmax_neg);
                % Add interpolated point with x2_ult_neg
                N=i1;
                x2_mod(N+2:length(x2_mod)+1)=x2_mod(N+1:length(x2_mod));
                y_mod(N+2:length(y_mod)+1)=y_mod(N+1:length(y_mod));
                x2_mod(N+1)=-x2_ult_neg; y_mod(N+1)=-0.8*Vmax_neg;

                A_neg=trapz(x2_mod(i_zero:i1+1),y_mod(i_zero:i1+1));

            else
                x2_ult_neg=-max(x2_mod);
                A_neg=trapz(x2_mod(i_zero:end),y_mod(i_zero:end));
            end


            % Compute final effective stiffness
            keff=mean([keff_pos, keff_neg]);

            % Compute Vmax (equal area up to du)
            % Area underneath envelope between du- and du+
            a=(-1/keff);
            b=-x2_ult_neg+x2_ult_pos;
            c=-(A_pos+A_neg);
            Vmax=(-b+sqrt(b^2-4*a*c))/(2*a)



            % bilinear approximation
            dy=Vmax/keff;
            x2_bilin=[ x2_ult_neg -dy 0 dy  x2_ult_pos]
            y_bilin=[ -Vmax -Vmax 0 Vmax  Vmax]


        else % if monotonic
            keff=keff_pos;
            % Compute Vmax (equal area up to du)
            % Area underneath envelope between du- and du+
            a=-1/(2*keff);
            b=x2_ult_pos;
            c=-A_pos;
            Vmax=(-b+sqrt(b^2-4*a*c))/(2*a)

            % bilinear approximation
            dy=Vmax/keff;
            x2_bilin=[ NaN NaN 0 dy  x2_ult_pos]
            y_bilin=[ NaN NaN 0 Vmax  Vmax]
            x2_ult_neg=NaN;

        end
        if plot_figures==1
            plot(x2_bilin,y_bilin,'k-')
        end

        du_pos_vec_new(k,1)=x2_ult_pos;
        du_neg_vec_new(k,1)=-x2_ult_neg;

    end
end

% Plot comparison with previous results
figure
plot(ID_vec,du_pos_vec_DB-du_pos_vec_new,'rx-'); hold on
plot(ID_vec(monotonic==0),du_neg_vec_DB(monotonic==0)-du_neg_vec_new(monotonic==0),'bx-'); hold on
ylabel('Difference in ultimate drifts')
legend('Positive direction','Negative direction')

figure
plot(ID_vec,du_pos_vec_DB-du_pos_vec_new,'rx-'); hold on
plot(ID_vec(monotonic==0),du_neg_vec_DB(monotonic==0)-du_neg_vec_new(monotonic==0),'bx-'); hold on
ylabel('Difference in ultimate drifts')
legend('Positive direction','Negative direction')
