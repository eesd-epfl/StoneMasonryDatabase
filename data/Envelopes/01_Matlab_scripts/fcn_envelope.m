function [x_env, x2_env,y_env] = fcn_envelope(x,x2,y)
% function to determine envelope of a force-deformation hysteresis or
% similar that contains cycles of increasing amplitude

x_env_pos=[];
y_env_pos=[];
x_env_neg=[];
y_env_neg=[];
x2_env_pos=[];
x2_env_neg=[];

for k=1:length(x)

    if x(k)>=0 % For positive x values
        if isempty(x_env_pos)==0
            if max(x_env_pos)<x(k)  % only add the value to the envelope if previous positive x-values were smaller
                x_env_pos=[x_env_pos x(k)];
                y_env_pos=[y_env_pos y(k)];
                x2_env_pos=[x2_env_pos x2(k)];
            end
        else
            x_env_pos=[x(k)];
            y_env_pos=[y(k)];
            x2_env_pos=[x2(k)];
        end
    elseif x(k)<0 % for negative x values
        if isempty(x_env_neg)==0
            if min(x_env_neg)>x(k) | isempty(x_env_neg)==1
                x_env_neg=[x_env_neg x(k)];
                y_env_neg=[y_env_neg y(k)];
                x2_env_neg=[x2_env_neg x2(k)];
            end
        else
            x_env_neg=[x(k)];
            y_env_neg=[y(k)];
            x2_env_neg=[x2(k)];
        end
    end
end

x_env=[x_env_neg(end:-1:1) x_env_pos]; x_env=x_env';
y_env=[y_env_neg(end:-1:1) y_env_pos]; y_env=y_env';
x2_env=[x2_env_neg(end:-1:1) x2_env_pos]; x2_env=x2_env';
