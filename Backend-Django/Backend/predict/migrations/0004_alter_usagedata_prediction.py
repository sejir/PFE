# Generated by Django 5.0.6 on 2024-07-08 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('predict', '0003_usagedata'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usagedata',
            name='prediction',
            field=models.FloatField(),
        ),
    ]
